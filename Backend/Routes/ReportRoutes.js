const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");

const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

const langToReport = {
    "EN": "idk.docx"
}

router.get('/:userId/download', async (req, res) => {
    const lang = req.headers["X-LANG"]?.toUpperCase() ?? "EN"
    
    const content = fs.readFileSync(
        path.resolve(__dirname, `../docx/${langToReport[lang]}`),
        "binary"
    );

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    doc.render({
        name: "John",
        today: "123123 123",
        status: "happy"
    });
    
    const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
    });
    
    const pdfBuf = await libre.convertAsync(buf, '.pdf', undefined);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');
    
    const stream = require('stream');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(pdfBuf);
    bufferStream.pipe(res);
})

module.exports = router;