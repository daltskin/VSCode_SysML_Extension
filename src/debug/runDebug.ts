/* eslint-disable no-console */
import { runVSCodeCommand } from '@vscode/test-electron';
import * as path from 'path';

async function main() {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        console.log('🚀 Launching VS Code Extension Development Host...');
        console.log(`📁 Extension path: ${extensionDevelopmentPath}`);
        console.log('🐧 Using Wayland-optimized settings for best compatibility...');
        console.log('⏳ This may take a moment to download/launch VS Code...');

        // Launch VS Code with enhanced Wayland support for better cursor positioning
        await runVSCodeCommand([
            '--extensionDevelopmentPath', extensionDevelopmentPath,
            '--disable-extensions',  // Disable other extensions for cleaner testing
            // Wayland-specific fixes for cursor offset issues
            '--ozone-platform=wayland',  // Use native Wayland support
            '--enable-wayland-ime',      // Better input method support
            '--disable-features=UseOzonePlatform',  // Fallback if Wayland causes issues
            // Display and cursor fixes
            '--force-device-scale-factor=1',  // Prevent scaling issues
            '--disable-gpu-sandbox',          // Sometimes helps with input offset
            '.'  // Open current folder
        ]);

        console.log('✅ VS Code Extension Development Host launched successfully!');
        console.log('🎯 Your SysML extension is now loaded with optimized Wayland support!');
        console.log('');
        console.log('📝 Test your extension by:');
        console.log('   • Opening a .sysml file');
        console.log('   • Using Ctrl+Shift+P and searching for "SysML" commands');
        console.log('   • Testing syntax highlighting, formatting, and validation');
        console.log('   • Checking the SysML Explorer in the sidebar');

    } catch (err) {
        console.error('❌ Failed to launch Extension Development Host:', err);
        console.log('');
        console.log('💡 Alternative options:');
        console.log('   • Press F5 in your current VS Code window');
        console.log('   • Use Run and Debug panel (Ctrl+Shift+D) → "Run Extension"');
        console.log('   • Command Palette (Ctrl+Shift+P) → "Debug: Start Debugging"');
        process.exit(1);
    }
}

main();
