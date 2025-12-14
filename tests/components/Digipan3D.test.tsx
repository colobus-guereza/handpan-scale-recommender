// tests/components/Digipan3D.test.tsx
import { render, screen } from '@testing-library/react';
import Digipan3D from '../../app/components/Digipan3D';

// Minimal mock props required for rendering
const mockProps = {
    notes: [],
    isCameraLocked: false,
    onNoteClick: () => { },
    onScaleSelect: () => { },
    backgroundImage: null,
    noteCountFilter: 10,
    enableZoom: true,
    enablePan: true,
    showControls: true,
    showInfoPanel: true,
    initialViewMode: 0,
    forceCompactView: true, // ensure mobile layout flag true
    // Additional required props with default values
    scale: null,
    centerX: 500,
    centerY: 500,
    onIsRecordingChange: () => { },
    cameraZoom: 12,
};

test('record button uses shared btnMobile class', () => {
    render(<Digipan3D {...mockProps} />);
    const recordButton = screen.getByTitle(/Start Recording|Stop Recording/);
    expect(recordButton).toBeInTheDocument();
    expect(recordButton.className).toContain('w-[38.4px]');
});
