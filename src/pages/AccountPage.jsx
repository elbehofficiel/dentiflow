import Navbar from '../components/Navbar'
import AccountManagement from '../components/AccountManagement'

function AccountPage() {
  return (
    <div>
      <Navbar />
      <AccountManagement />
      <footer className="bg-blue-600 text-white py-6">
        <div className="container mx-auto text-center">
          <p>© 2025 Dentiflow. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

export default AccountPage