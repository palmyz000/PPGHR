const tenantMiddleware = (req, res, next) => {
    const tenantId = req.headers['x-tenant-id']; // หรือมาจาก token
    if (!tenantId) {
        return res.status(400).json({ message: 'Tenant ID is required.' });
    }
    req.tenantId = tenantId; // เก็บ tenant_id ไว้ใน request
    next();
};
module.exports = tenantMiddleware;
