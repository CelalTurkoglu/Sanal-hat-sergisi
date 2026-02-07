const fs = require('fs');
const path = require('path');

// Check if running in Railway (or explicit production build)
// Railway sets RAILWAY_ENVIRONMENT_NAME
if (process.env.RAILWAY_ENVIRONMENT_NAME) {
    console.log('🚀 Railway deployment detected. Switching to PostgreSQL schema...');

    const prodSchemaPath = path.join(__dirname, '../prisma/schema.postgresql.prisma');
    const targetSchemaPath = path.join(__dirname, '../prisma/schema.prisma');

    if (fs.existsSync(prodSchemaPath)) {
        try {
            fs.copyFileSync(prodSchemaPath, targetSchemaPath);
            console.log('✅ Successfully updated schema.prisma to PostgreSQL version.');
        } catch (error) {
            console.error('❌ Error copying schema file:', error);
            process.exit(1);
        }
    } else {
        console.warn('⚠️ PostgreSQL schema file not found at:', prodSchemaPath);
        // Don't fail, maybe it's already correct or intentionally missing
    }
} else {
    console.log('ℹ️ Local environment detected. Keeping existing schema.');
}
