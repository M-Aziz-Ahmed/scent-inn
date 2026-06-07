import AdminNav from '../AdminNav'
import UsersClient from './UsersClient'

export default function UsersPage() {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <UsersClient />
        </div>
      </main>
    </div>
  )
}
