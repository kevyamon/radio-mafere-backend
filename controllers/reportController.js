// controllers/reportController.js
const PDFDocument = require('pdfkit');
const User = require('../models/User');
const Post = require('../models/Post');
const Announcement = require('../models/Announcement');

// @desc    Générer un rapport d'activité hebdomadaire
// @route   GET /api/reports/weekly
// @access  Privé/Admin
const generateWeeklyReport = async (req, res) => {
  try {
    const doc = new PDFDocument({ margin: 50 });

    // Configuration de la réponse pour envoyer un PDF
    const reportName = `Rapport_RadioMafere_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${reportName}"`);

    // Le PDF est envoyé directement dans la réponse
    doc.pipe(res);

    // --- Contenu du PDF ---

    // En-tête
    doc.fontSize(20).text('Rapport d\'Activité Hebdomadaire', { align: 'center' });
    doc.fontSize(12).text(`Radio Maféré - Semaine du ${new Date(new Date() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')} au ${new Date().toLocaleDateString('fr-FR')}`, { align: 'center' });
    doc.moveDown(2);

    // Calcul de la date de début (il y a 7 jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // --- Section 1: Nouveaux Utilisateurs ---
    const newUsers = await User.find({ createdAt: { $gte: sevenDaysAgo } }).select('prenom nom email createdAt');
    doc.fontSize(16).text('Nouveaux Inscrits', { underline: true });
    doc.moveDown();

    if (newUsers.length > 0) {
      newUsers.forEach(user => {
        doc.fontSize(10).text(`- ${user.prenom} ${user.nom} (${user.email}) - Inscrit le ${user.createdAt.toLocaleDateString('fr-FR')}`);
      });
    } else {
      doc.fontSize(10).text('Aucun nouvel utilisateur cette semaine.');
    }
    doc.moveDown(2);


    // --- Section 2: Nouvelles Dédicaces ---
    const newPosts = await Post.find({ type: 'dédicace', createdAt: { $gte: sevenDaysAgo } }).populate('author', 'prenom');
    doc.fontSize(16).text('Nouvelles Dédicaces', { underline: true });
    doc.moveDown();
    
    if (newPosts.length > 0) {
        newPosts.forEach(post => {
            doc.fontSize(10).text(`- De ${post.author.prenom} (Le ${post.createdAt.toLocaleDateString('fr-FR')}): "${post.content.substring(0, 80)}..."`);
        });
    } else {
        doc.fontSize(10).text('Aucune nouvelle dédicace cette semaine.');
    }
    doc.moveDown(2);


    // --- Section 3: Nouvelles Annonces (approuvées) ---
    const newAnnouncements = await Announcement.find({ status: 'approuvée', createdAt: { $gte: sevenDaysAgo } }).populate('author', 'prenom');
    doc.fontSize(16).text('Nouvelles Annonces Approuvées', { underline: true });
    doc.moveDown();

    if (newAnnouncements.length > 0) {
        newAnnouncements.forEach(annonce => {
            doc.fontSize(10).text(`- [${annonce.category}] ${annonce.title} (par ${annonce.author.prenom})`);
        });
    } else {
        doc.fontSize(10).text('Aucune nouvelle annonce approuvée cette semaine.');
    }


    // Finalisation du PDF
    doc.end();

  } catch (error) {
    console.error("Erreur lors de la génération du rapport PDF:", error);
    res.status(500).send('Erreur serveur lors de la génération du rapport.');
  }
};

module.exports = {
  generateWeeklyReport,
};