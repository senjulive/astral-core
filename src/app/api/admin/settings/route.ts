import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';

const SETTINGS_FILE_PATH = path.join(process.cwd(), 'data', 'settings.json');

async function readSettings() {
  try {
    const data = await fs.readFile(SETTINGS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty object
    return {};
  }
}

async function writeSettings(data: any) {
  await fs.writeFile(SETTINGS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(request: Request) {
  try {
    const { key, value } = await request.json();
    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required.' }, { status: 400 });
    }

    const settings = await readSettings();
    // This allows nested key updates, e.g., key = "botSettings"
    settings[key] = value;
    await writeSettings(settings);

    return NextResponse.json({ success: true, message: 'Settings updated.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
