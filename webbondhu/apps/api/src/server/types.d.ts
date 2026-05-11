declare global { namespace Express { interface Request { id: string; user?: { id: string; roles: string[] }; tenant?: { businessId: string }; } } }
export {};
