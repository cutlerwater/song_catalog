import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "songs.json");

// ===== READ =====
function readSongs() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// ===== WRITE =====
function writeSongs(songs: any) {
  fs.writeFileSync(filePath, JSON.stringify(songs, null, 2));
}

// GET
export async function GET() {
  const songs = readSongs();
  return NextResponse.json(songs);
}

// POST
export async function POST(req: Request) {
  const songs = readSongs();
  const newSong = await req.json();

  songs.push(newSong);
  writeSongs(songs);

  return NextResponse.json({ success: true });
}

// DELETE
export async function DELETE(req: Request) {
  const { index } = await req.json();
  const songs = readSongs();

  songs.splice(index, 1);
  writeSongs(songs);

  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const { index, updatedSong } = await req.json();

  const songs = readSongs();

  songs[index] = updatedSong;

  writeSongs(songs);

  return NextResponse.json({ success: true });
}