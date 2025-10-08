'use client'

import { useEffect, useState } from 'react'
import { Bell, Trash2, Eye, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import clsx from 'clsx'

interface Notification {
  id: number
  contenu: string
  systeme: string
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Notification | null>(null)

  // Charger les notifications depuis l'API
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch('/api/vendeur/notifications')
        const data = await res.json()
        setNotifications(data)
      } catch (error) {
        console.error('Erreur de chargement des notifications', error)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  // Supprimer une notification
  async function deleteNotification(id: number) {
    await fetch(`/api/vendeur/notifications/${id}`, { method: 'DELETE' })
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    setSelected(null)
  }

  // Supprimer toutes les notifications
  async function deleteAll() {
    await fetch('/api/vendeur/notifications', { method: 'DELETE' })
    setNotifications([])
    setSelected(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin w-8 h-8 text-gray-400" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Bell className="text-orange-500" />
          Mes notifications
        </h1>
        {notifications.length > 0 && (
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={deleteAll}
          >
            <Trash2 className="w-4 h-4" /> Tout supprimer
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Bell className="mx-auto w-12 h-12 mb-4 text-gray-300" />
          <p>Aucune notification pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              whileHover={{ scale: 1.02 }}
              className={clsx(
                'cursor-pointer rounded-2xl border bg-white shadow-sm hover:shadow-md transition p-4',
                selected?.id === notif.id && 'ring-2 ring-orange-400'
              )}
              onClick={() => setSelected(notif)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-orange-600">
                  {notif.systeme}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNotification(notif.id)
                  }}
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>
              </div>
              <p className="text-gray-700 line-clamp-2">{notif.contenu}</p>
              <span className="text-xs text-gray-400 mt-2 block">
                {new Date(notif.createdAt).toLocaleString('fr-FR')}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Détails d'une notification */}
      {selected && (
        <motion.div
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <Card
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="text-orange-500" /> Détails
                </h2>
                <button
                  onClick={() => deleteNotification(selected.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              </div>
              <p className="text-gray-800 mb-4">{selected.contenu}</p>
              <p className="text-sm text-gray-400">
                Reçue le{' '}
                {new Date(selected.createdAt).toLocaleString('fr-FR')}
              </p>
              <div className="flex justify-end mt-6">
                <Button onClick={() => setSelected(null)}>Fermer</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
