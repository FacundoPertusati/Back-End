export const PORT =  process.argv[2] || 8080
export const JWT_SECRET = "secretpass"
export const wrongMsgRoute = {"error":"ruta equivocada"}
export const msgs = {
    error: "Something went wrong ====>>>",
    products: {
        read: "You don't have created yet any products in database",
        find: "The product that you're trying to find by id doesn't exist in database.",
        update: "The product that you're trying to update doesn't exist in database",
        delete: "The product that you're trying to  delete doesn't exist in database.",
        category: "The category that you're trying to filter is not available in database."
    },
    users: {
        save: "The email that you're trying to signup is already created in our database, please try again with a different address."
    }
}