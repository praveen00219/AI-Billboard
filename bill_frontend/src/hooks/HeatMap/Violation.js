import express from "express";

const router=express.Router();



router.get('/violations', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        r.id,
        r.title,
        r.category,
        r.description,
        r.latitude,
        r.longitude,
        r.status,
        r.risk_level,
        u.username AS name
      FROM reports r
      JOIN userAuth u ON r.citizenId = u.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;