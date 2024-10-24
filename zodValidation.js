const { z } = require("zod");

const expenseSchema = z.object({
    amount: z.number().positive().min(1),
    category: z.string().min(1),
    date: z.coerce.date(),
    description: z.string().optional()
});

module.exports = { expenseSchema };