import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { scaleId, layoutData } = body;

        if (!scaleId || !layoutData) {
            return NextResponse.json(
                { error: 'Missing scaleId or layoutData' },
                { status: 400 }
            );
        }

        // Define the path to the layouts directory
        const dataDir = path.join(process.cwd(), 'data');
        const layoutsDir = path.join(dataDir, 'layouts');

        // Ensure directories exist
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }
        if (!fs.existsSync(layoutsDir)) {
            fs.mkdirSync(layoutsDir);
        }

        // Write the file
        const filePath = path.join(layoutsDir, `${scaleId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(layoutData, null, 2));

        return NextResponse.json({ success: true, message: 'Layout saved successfully' });
    } catch (error) {
        console.error('Error saving layout:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
