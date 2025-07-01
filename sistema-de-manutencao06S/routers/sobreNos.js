const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('sobreNos'); // Renderizar a página "sobreNos.handlebars"
});

module.exports = router;
