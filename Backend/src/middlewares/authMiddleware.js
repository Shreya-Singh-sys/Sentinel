exports.checkRole = (role) => {
  return async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    
    if (!idToken) return res.status(401).send('Unauthorized');

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      if (decodedToken.role === role || decodedToken.role === 'admin') {
        req.user = decodedToken;
        next();
      } else {
        res.status(403).send('Forbidden: Access Denied');
      }
    } catch (error) {
      res.status(401).send('Invalid Token');
    }
  };
};