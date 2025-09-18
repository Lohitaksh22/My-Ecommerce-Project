import { useState, useEffect } from "react"
import useInterceptors from "../hooks/useInterceptors"



const Account = () => {
  const api = useInterceptors()
  const [account, setAccount] = useState()
  const [username, setUsername] = useState("")
  const [lastLogin, setLastLogin] = useState(null)
  const [email, setEmail] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [passwordCheck, setPasswordCheck] = useState("")
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")

  const getAccount = async () => {
    try {
      const res = await api.get('/account/profile')
      setEmail(res.data.email)
      setUsername(res.data.username)
      setLastLogin(new Date(res.data.lastLogin))
      setAccount({
        username: res.data.username,
        email: res.data.email,
      })
      setNewPassword("")
      setCurrentPassword("")

    } catch (err) {
      console.error(err)

    }
  }

  useEffect(() => {
    getAccount()
  }, [api])

  const editing = () => {
    setIsEditing(!isEditing)
  }

  const editingEmail = () => {
    setIsEditingEmail(!isEditingEmail)
  }

  const updateAccount = async () => {
    try {
      await api.put('/account/profile', {
        newUsername: username,
        newEmail: email,
        newPassword: newPassword
      })
      getAccount()



    } catch (err) {
      console.error(err)

    }
  }

  const checkPassword = async () => {
    try {
      const res = await api.post('/account/password-check',
        { password: currentPassword })
      setPasswordCheck(res.data.msg)

    } catch (err) {
      setPasswordCheck("Incorrect Password")
      console.error(err)

    }
  }

  const validPassword = (password) => {
    if (!password) return false
    const minLength = password.length >= 8
    const hasNumber = /\d/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return minLength && hasNumber && hasUpper && hasLower && hasSpecial
  }



  return (
    <div className="flex flex-col items-center justify-center bg-linear-45 from-blue-400 to-purple-400 min-h-screen">
      <div className="flex flex-col min-w-120  rounded-2xl hover:shadow-2xl shadow-md px-8 py-10 space-y-4 bg-white w-auto h-100 rounded ">
        <p className="font-semibold hover:text-blue-500">UserName: </p>
        {isEditing ?
          <div className="flex space-x-4">
            <input className="px-2 py-1 w-75 outline-none border-1 border-blue-500 rounded focus:ring-2 focus:ring-blue-500 transition duration-300" type="text" value={username} onChange={(e) => {
              setUsername(e.target.value)
            }}></input>

            <div className="flex space-x-2 ">
              <button className="bg-blue-500 text-white px-4 text-sm py-1 rounded-2xl hover:opacity-75 active:scale-95"
                onClick={() => {
                  updateAccount()
                  setIsEditing(false)
                }}
              >Save</button>
              <button className="bg-red-500 text-white px-4 text-sm py-1 rounded-2xl hover:opacity-75 active:scale-95"
                onClick={
                  () => {
                    editing()
                    setUsername(account.username)
                  }}>Cancel</button>
            </div>
          </div> : <p onClick={() => editing()} className="cursor-pointer">{username}</p>
        }
        <p className="font-semibold hover:text-blue-500">Email: </p>
        {isEditingEmail ?
          <div className="flex space-x-4">
            <input className="px-2 py-1 w-75 border-1 outline-none border-blue-500 rounded focus:ring-2 focus:ring-blue-500 transition duration-300" type="text" value={email} onChange={(e) => {
              setEmail(e.target.value)
            }}></input>

            <div className="flex space-x-2 ">
              <button
                onClick={() => {
                  updateAccount()
                  setIsEditingEmail(false)
                }}
                className="bg-blue-500 text-white px-4 text-sm py-1 rounded-2xl hover:opacity-75 active:scale-95">Save</button>
              <button className="bg-red-500 text-white px-4 text-sm py-1 rounded-2xl hover:opacity-75 active:scale-95" onClick={
                () => {
                  editingEmail()
                  setEmail(account.email)
                }}>Cancel</button>
            </div>
          </div> : <p className="cursor-pointer" onClick={() => editingEmail()}>{email}</p>
        }

        <p onClick={() => setIsEditingPassword(!isEditingPassword)} className="mt-auto flex justify-center font-semibold cursor-pointer active:scale-95 hover:text-blue-500 ">Want to Change Password? Click Here</p>

        {isEditingPassword &&
          <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col space-y-4 px-8 py-8 bg-white w-100 h-auto items-center rounded-lg justify-center">
              <p className="font-bold">Enter Current Password: </p>
              <input className="px-2 py-1 w-70 outline-none border border-blue-500 rounded  w-full focus:ring-2 focus:ring-blue-400 transition duration-300" type="password" value={currentPassword} name="account-current-password" autoComplete="current-password" onChange={(e) => setCurrentPassword(e.target.value)}></input>
              <button
                onClick={async () => {
                  await checkPassword()
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:opacity-75 active:scale-95 cursor-pointer"
              >Check Password</button>
              {passwordCheck === "Password Correct" ?
                <>

                  <p className="text-sm font-semibold text-green-400">Correct Password</p>
                  <p className="font-bold">Enter New Password:</p>
                  <input
                    className="px-2 py-1 w-70 outline-none border border-blue-500 rounded  w-full focus:ring-2 focus:ring-blue-400 transition duration-300
                  invalid:border-pink-500 invalid:text-pink-500
                  "
                    type="password" onChange={(e) => setNewPassword(e.target.value)} ></input>
                  {validPassword(newPassword) ? <button className="bg-green-500 text-white px-4 py-2 rounded-xl hover:opacity-75 active:scale-95 cursor-pointer" onClick={() => {
                    setIsEditingPassword(false)
                    updateAccount()
                  }}>Update Password</button> :

                    <div className="text-sm font-bold text-red-500 leading-relaxed mt-2">
                      Password must include:
                      <ul className="list-disc list-inside text-red-500 text-sm font-semibold ">
                        <li className={newPassword.length >= 8 ? "text-green-500" : "text-red-500"}>8+ characters{ }</li>
                        <li className={/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? "text-green-500" : "text-red-500"}>Upper & lower case</li>
                        <li className={/[\d]/.test(newPassword) ? "text-green-500" : "text-red-500"}>Number</li>
                        <li className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-green-500" : "text-red-500"}>Special character</li>
                      </ul>
                    </div>

                  }
                  <button className="bg-red-500 text-white px-4 text-sm py-1 rounded-2xl hover:opacity-75 active:scale-95" onClick={() => setIsEditingPassword(false)}>Exit</button>
                </> :
                <div className="flex flex-col space-y-4 items-center justify-center">
                  <p className="text-sm font-semibold text-red-500">{passwordCheck}</p>
                  <button className="bg-red-500 text-white px-4 text-sm py-1 rounded-2xl hover:opacity-75 active:scale-95" onClick={() => setIsEditingPassword(false)}>Exit</button>
                </div>
              }

            </div>
          </div>}
        <p className="mt-auto ml-auto font-semibold hover:text-blue-500">Last-Login: {lastLogin?.toLocaleString()}</p>

      </div>
    </div>
  )
}

export default Account
