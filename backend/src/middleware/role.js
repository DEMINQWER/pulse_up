module.exports = (roles = []) => {
  // Если передали одну строку — превращаем в массив
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    try {
      // Проверяем наличие пользователя
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Проверяем наличие роли
      if (!req.user.role) {
        return res.status(403).json({ error: 'User role not found' });
      }

      // Если роли не указаны — доступ запрещён
      if (!Array.isArray(roles) || roles.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Проверка роли
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      next();

    } catch (err) {
      console.error('Role middleware error:', err.message);
      return res.status(500).json({ error: 'Server error' });
    }
  };
};