const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connection = require('../config/db');

// Define a route to fetch family members based on no_kk
router.get('/:no_kk/members', function (req, res) {
    let no_kk = req.params.no_kk;

    // Query the database to fetch family members based on no_kk
    connection.query(
        'SELECT * FROM anggota_keluarga WHERE no_kk = ?',
        [no_kk],
        function (err, rows) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    status: false,
                    message: 'Server Error',
                });
            }
            if (rows.length <= 0) {
                return res.status(404).json({
                    status: false,
                    message: 'No family members found for the provided no_kk.',
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'Family Members',
                    data: rows,
                });
            }
        }
    );
});


router.get('/', function (req, res) {
    connection.query('SELECT * FROM kartu_keluarga', function (err, rows) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Kartu Keluarga',
                data: rows,
            });
        }
    });
});

router.post('/add/kk', [
    body('no_kk').notEmpty(),
    body('alamat').notEmpty(),
    body('rt').notEmpty(),
    body('rw').notEmpty(),
    body('kode_pos').notEmpty(),
    body('desa_kelurahan').notEmpty(),
    body('kecamatan').notEmpty(),
    body('kabupaten_kota').notEmpty(),
    body('provinsi').notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }
    let data = {
        no_kk: req.body.no_kk,
        alamat: req.body.alamat,
        rt: req.body.rt,
        rw: req.body.rw,
        kode_pos: req.body.kode_pos,
        desa_kelurahan: req.body.desa_kelurahan,
        kecamatan: req.body.kecamatan,
        kabupaten_kota: req.body.kabupaten_kota,
        provinsi: req.body.provinsi,
    };
    connection.query('INSERT INTO kartu_keluarga SET ?', data, function (err, result) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(201).json({
                status: true,
                message: 'Data Kartu Keluarga berhasil ditambahkan.',
                data: data,
            });
        }
    });
});

router.get('/:no_kk', function (req, res) {
    let no_kk = req.params.no_kk;
    connection.query('SELECT * FROM kartu_keluarga WHERE no_kk = ?', [no_kk], function (err, rows) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        }
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data tidak ditemukan.',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Kartu Keluarga',
                data: rows[0],
            });
        }
    });
});

router.patch('/update/:id', [
    body('no_kk').notEmpty(),
    body('alamat').notEmpty(),
    body('rt').notEmpty(),
    body('rw').notEmpty(),
    body('kode_pos').notEmpty(),
    body('desa_kelurahan').notEmpty(),
    body('kecamatan').notEmpty(),
    body('kabupaten_kota').notEmpty(),
    body('provinsi').notEmpty(),
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let Data = {
        no_kk: req.body.no_kk,
        alamat: req.body.alamat,
        rt: req.body.rt,
        rw: req.body.rw,
        kode_pos: req.body.kode_pos,
        desa_kelurahan: req.body.desa_kelurahan,
        kecamatan: req.body.kecamatan,
        kabupaten_kota: req.body.kabupaten_kota,
        provinsi: req.body.provinsi
    }
    connection.query(`update kartu_keluarga set ? where no_kk = ${id}`, Data, function (err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        }else{
            return res.status(200).json({
                status: true,
                message: 'Update Success..!'
            })
        }
    })
})

router.delete('/delete/:no_kk', function (req, res) {
    let no_kk = req.params.no_kk;
    connection.query('DELETE FROM kartu_keluarga WHERE no_kk = ?', [no_kk], function (err, result) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Kartu Keluarga berhasil dihapus.',
            });
        }
    });
});

module.exports = router;
