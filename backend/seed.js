import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

async function seed() {
    try {
        const url = process.env.MONGO_URL || process.env.MONGODB_URL;
        console.log('Menghubungkan ke:', url.split('@')[1] || 'Local DB');
        await mongoose.connect(url);

        const UserSchema = new mongoose.Schema({
            username: { type: String, required: true, unique: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            role: { type: String, default: "petani" },
        });

        const User = mongoose.model('User', UserSchema);

        const hashAdmin = await bcrypt.hash('admin123', 10);
        const hashPetani = await bcrypt.hash('petani123', 10);

        // Bersihkan data lama
        await User.deleteMany({ username: { $in: ['admin', 'petani'] } });

        // Buat user baru
        await User.create([
            { username: 'admin', email: 'admin@sitani.com', password: hashAdmin, role: 'admin' },
            { username: 'petani', email: 'petani@sitani.com', password: hashPetani, role: 'petani' }
        ]);

        console.log('SUKSES! User admin & petani sudah di-reset.');
        console.log('Admin -> User: admin, Pass: admin123');
        console.log('Petani -> User: petani, Pass: petani123');
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

seed();
