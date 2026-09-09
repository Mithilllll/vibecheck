import fs from "fs";
import path from "path";
import { promisify } from "util";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

export interface SaveFileInput {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  prefix?: string;
}

export interface SavedFile {
  filePath: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface StorageProvider {
  save(input: SaveFileInput): Promise<SavedFile>;
  readBuffer(filePath: string): Promise<Buffer>;
  delete?(filePath: string): Promise<void>;
}

class LocalStorageProvider implements StorageProvider {
  private baseDir: string;
  private publicUrlBase: string;

  constructor() {
    this.baseDir = process.env.LOCAL_UPLOAD_DIR || "./uploads";
    this.publicUrlBase = process.env.NEXT_PUBLIC_APP_URL || "";
  }

  private async ensureDir(dir: string) {
    await mkdir(dir, { recursive: true });
  }

  async save(input: SaveFileInput): Promise<SavedFile> {
    const prefix = input.prefix?.replace(/^\/+/, "") || "";
    const dir = path.join(this.baseDir, prefix);

    await this.ensureDir(dir);

    const unique = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const safeName = input.fileName.replace(/[^a-zA-Z0-9.\-_]/g, "-");
    const fileName = `${unique}-${safeName}`;
    const fullPath = path.join(dir, fileName);

    await writeFile(fullPath, input.buffer);

    const filePath = path
      .join(prefix, fileName)
      .split(path.sep)
      .join("/");

    const fileUrl = this.publicUrlBase
      ? `${this.publicUrlBase.replace(/\/$/, "")}/uploads/${filePath}`
      : `/uploads/${filePath}`;

    return {
      filePath,
      fileUrl,
      fileName: input.fileName,
      mimeType: input.mimeType,
      sizeBytes: input.buffer.length,
    };
  }

  async readBuffer(filePath: string): Promise<Buffer> {
    return readFile(path.join(this.baseDir, filePath));
  }

  async delete(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(path.join(this.baseDir, filePath));
    } catch {
      // Ignore missing files
    }
  }
}

class CloudinaryStorageProvider implements StorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async save(input: SaveFileInput): Promise<SavedFile> {
    const result = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const upload = cloudinary.uploader.unsigned_upload_stream(
          process.env.CLOUDINARY_UPLOAD_PRESET!,
          (error, uploaded) => {
            if (error || !uploaded) {
              reject(error || new Error("Cloudinary upload failed"));
              return;
            }

            resolve(uploaded);
          }
        );

        upload.end(input.buffer);
      }
    );

    return {
      filePath: result.secure_url,
      fileUrl: result.secure_url,
      fileName: input.fileName,
      mimeType: input.mimeType,
      sizeBytes: input.buffer.length,
    };
  }

  async readBuffer(filePath: string): Promise<Buffer> {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error("Could not download file from Cloudinary");
    }

    return Buffer.from(await response.arrayBuffer());
  }
}

let instance: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (instance) {
    return instance;
  }

  if (process.env.STORAGE_PROVIDER === "cloudinary") {
    instance = new CloudinaryStorageProvider();
  } else {
    instance = new LocalStorageProvider();
  }

  return instance;
}