const isAuthenticated = (req, res, next) => {
    // Passport.js adds a `req.isAuthenticated()` method
    if (req.isAuthenticated()) {
      return next(); // If authenticated, proceed to the next middleware or route handler
    }
  
    // If not authenticated, respond with an error
    res.status(401).json({ error: 'Unauthorized. Please log in to access this resource.' });
  };
  
  module.exports = isAuthenticated;
  