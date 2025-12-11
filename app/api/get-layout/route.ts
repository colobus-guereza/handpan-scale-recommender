import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const scaleId = searchParams.get('scaleId');

        if (!scaleId) {
            return NextResponse.json(
                { error: 'Missing scaleId' },
                { status: 400 }
            );
        }

        const filePath = path.join(process.cwd(), 'data', 'layouts', `${scaleId}.json`);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: 'Layout not found' },
                { status: 404 }
            );
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const layoutData = JSON.parse(fileContent);

        return NextResponse.json(layoutData);
    } catch (error) {
        console.error('Error loading layout:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
