export const UserModel = {
  id: String,
  username: String,
  email: String,
  role: new Set(['admin', 'user']),
}
