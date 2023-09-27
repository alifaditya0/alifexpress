// routes/detailRouter.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { body, validationResult } = require('express-validator');
const connection = require('../config/db');


// CRUD untuk tabel Detail KK
router.get('/', (req, res) => {
    // Query untuk mengambil detail kartu keluarga dan informasi terkait
    const query = `
    SELECT
    dk.no_kk,
    k1.nama_lengkap AS nama_anggota,
    k2.nama_lengkap AS nama_ayah,
    k3.nama_lengkap AS nama_ibu,
    dk.status_hubungan_dalam_keluarga
FROM
    detail_kk AS dk
INNER JOIN
    ktp AS k1 ON dk.nik = k1.nik
LEFT JOIN
    ktp AS k2 ON dk.ayah = k2.nik
LEFT JOIN
    ktp AS k3 ON dk.ibu = k3.nik;

    `;

    // Menjalankan query di database
    connection.query(query, (err, rows) => {
        if (err) {
            // Jika terjadi kesalahan, kirim respon 500 (Internal Server Error)
            return res.status(500).json({
                status: false,
                message: 'Server Gagal',
            });
        } else {
            // Jika berhasil, kirim respon 200 (OK) dengan data yang ditemukan
            return res.status(200).json({
                status: true,
                message: 'Data Detail KK',
                data: rows,
            });
        }
    });
});


router.post('/store', [
    // Validasi untuk input data
    body('no_kk').notEmpty().withMessage('No. KK harus diisi'),
    body('nik').notEmpty().withMessage('NIK harus diisi'),
    body('status_hubungan_dalam_keluarga').notEmpty().withMessage('Status hubungan harus diisi'),
    // Tambahkan validasi lain sesuai dengan skema Detail KK
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }

    // Isi data dari permintaan
    const data = {
        no_kk: req.body.no_kk,
        nik: req.body.nik,
        status_hubungan_dalam_keluarga: req.body.status_hubungan_dalam_keluarga,
        ayah: req.body.ayah,
        ibu: req.body.ibu,
    };

    db.query('INSERT INTO detail_kk SET ?', data, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            data.id_detail = result.insertId;
            return res.status(201).json({
                status: true,
                message: 'Data Detail KK berhasil ditambahkan',
                data: data,
            });
        }
    });
});

router.patch('/update/:id_detail', [
    // Validasi untuk input data yang akan diperbarui
    body('status_hubungan_dalam_keluarga').optional(), // Izinkan status hubungan menjadi opsional
    // Tambahkan validasi lain sesuai dengan skema Detail KK
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }

    const id_detail = req.params.id_detail;
    const data = {
        status_hubungan_dalam_keluarga: req.body.status_hubungan_dalam_keluarga || null, // Menggunakan nilai yang diberikan atau null jika tidak ada
        ayah: req.body.ayah,
        ibu: req.body.ibu,
    };

    db.query('UPDATE detail_kk SET ? WHERE id = ?', [data, id_detail], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Detail KK berhasil diperbarui',
            });
        }
    });
});

router.get('/:id_detail', (req, res) => {
    const id_detail = req.params.id_detail;

    // Query basis data untuk mendapatkan data Detail KK beserta nama, status_hubungan_dalam_keluarga, ayah, dan ibu
    db.query(
        `SELECT dk.no_kk, k1.nama_lengkap AS nama_anggota, k2.nama_lengkap AS nama_ayah, k3.nama_lengkap AS nama_ibu, dk.status_hubungan_dalam_keluarga FROM detail_kk AS dk INNER JOIN ktp AS k1 ON dk.nik = k1.nik LEFT JOIN ktp AS k2 ON dk.ayah = k2.nik LEFT JOIN ktp AS k3 ON dk.ibu = k3.nik where id=${id_detail}`, id_detail,
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Server Error',
                    error : err
                });
            }

            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Data Detail KK tidak ditemukan',
                });
            }

            const detailKKData = rows[0]; // Ambil data Detail KK pertama dari hasil query

            return res.status(200).json({
                status: true,
                message: 'Data Detail KK beserta nama, status hubungan, ayah, dan ibu',
                data: detailKKData,
            });
        }
    );
});



// Menghapus data dari tabel Detail KK
router.delete('/:id_detail', (req, res) => {
    const id_detail = req.params.id_detail;
    db.query(`SELECT dk.no_kk, k1.nama_lengkap AS nama_anggota, k2.nama_lengkap AS nama_ayah, k3.nama_lengkap AS nama_ibu, dk.status_hubungan_dalam_keluarga FROM detail_kk AS dk INNER JOIN ktp AS k1 ON dk.nik = k1.nik LEFT JOIN ktp AS k2 ON dk.ayah = k2.nik LEFT JOIN ktp AS k3 ON dk.ibu = k3.nik where id=${id_detail}`, id_detail, 
    (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Detail KK berhasil dihapus',
            });
        }
    });
});


module.exports = router;