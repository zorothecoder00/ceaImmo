'use client'

import { useEffect, useState } from 'react'
import { Bell, Trash2, Loader2, CheckCheck, Mail, MessageSquare, X, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'   
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import clsx from 'clsx'   
import { Systeme } from '@prisma/client'  

interface User {
  id: number
  nom: string
  prenom: string
}

interface Notification {
  id: number  
  contenu: string
  systeme: Systeme
  lien?: string | null
  dateNotification: string
  user: User
  emetteur?: User | null
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Notification | null>(null)
  const [filter, setFilter] = useState<'TOUS' | Systeme>('TOUS')
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch('/api/notifications')
        const data = await res.json()
        setNotifications(data.data)
      } catch (error) {
        console.error('Erreur de chargement des notifications', error)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  async function deleteNotification(id: number) {
    setDeleting(id)
    try {
      await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }), // ✅
      })

      setNotifications(prev => prev.filter(n => n.id !== id))
      if (selected?.id === id) setSelected(null)
    } catch (error) {
      console.error('Erreur de suppression', error)
    } finally {
      setDeleting(null)
    }
  }

  async function deleteAll() {
    try {
      await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      setNotifications([])
      setSelected(null)
    } catch (error) {
      console.error('Erreur de suppression', error)
    }
  }

  const getSystemIcon = (systeme: Systeme) => {
    switch (systeme) {
      case Systeme.SMS:
        return <MessageSquare className="w-4 h-4" />
      case Systeme.MAIL:
        return <Mail className="w-4 h-4" />
      case Systeme.PUSH:
        return <Bell className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getSystemColor = (systeme: Systeme) => {
    switch (systeme) {
      case Systeme.SMS:
        return 'bg-blue-50 text-blue-600 border-blue-200'
      case Systeme.MAIL:
        return 'bg-purple-50 text-purple-600 border-purple-200'
      case Systeme.PUSH:
        return 'bg-orange-50 text-orange-600 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  const filteredNotifications =
    filter === 'TOUS'
      ? notifications
      : notifications.filter(n => n.systeme === filter)

  const types = ['TOUS', 'SMS', 'MAIL', 'PUSH'] as const;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <Loader2 className="animate-spin w-10 h-10 text-orange-500" />
        <p className="text-gray-500 text-sm">Chargement des notifications...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto"
    >
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
            <div className="p-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg">
              <Bell className="text-white w-6 h-6" />
            </div>
            Notifications
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {notifications.length} notification{notifications.length > 1 ? 's' : ''} au total
          </p>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-all"
              onClick={deleteAll}
            >
              <CheckCheck className="w-4 h-4" /> Tout lire
            </Button>
            <Button
              variant="destructive"
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
              onClick={deleteAll}
            >
              <Trash2 className="w-4 h-4" /> Tout supprimer
            </Button>
          </div>
        )}
      </div>

      {/* Filtres */}
      {notifications.length > 0 && (
        <motion.div    
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 flex-wrap"
        >
          {types.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              filter === type
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            )}
          >
            {type === 'TOUS'
              ? `Tous (${notifications.length})`
              : `${type} (${notifications.filter(n => n.systeme === type).length})`}
          </button>
        ))}
        </motion.div>
      )}

      {/* Liste des notifications */}
      {filteredNotifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="inline-flex p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full mb-4">
            <Bell className="w-16 h-16 text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {filter === 'TOUS' ? 'Aucune notification' : `Aucune notification ${filter}`}
          </h3>
          <p className="text-gray-400">Vous êtes à jour !</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group"
              >
                <Card
                  className={clsx(
                    'cursor-pointer border-2 overflow-hidden transition-all duration-200 hover:shadow-xl',
                    selected?.id === notif.id
                      ? 'ring-2 ring-orange-400 border-orange-300 shadow-lg'
                      : 'border-gray-100 hover:border-orange-200'
                  )}
                  onClick={() => setSelected(notif)}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* En-tête de la carte */}
                    <div className="flex justify-between items-start gap-2">
                      <div className={clsx(
                        'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border',
                        getSystemColor(notif.systeme)
                      )}>
                        {getSystemIcon(notif.systeme)}
                        {notif.systeme}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notif.id)
                        }}
                        disabled={deleting === notif.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deleting === notif.id ? (
                          <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                        )}
                      </button>
                    </div>

                    {/* Contenu */}
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                      {notif.contenu}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                        {new Date(notif.dateNotification).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>

                      {notif.emetteur && (
                        <span className="text-xs text-gray-500">
                          De {notif.emetteur.prenom} {notif.emetteur.nom}
                        </span>
                      )}
                      
                      {notif.lien && (
                      <a
                        href={notif.lien}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-orange-500 hover:underline"
                      >
                        Ouvrir
                      </a>
                    )}

                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal détails */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <Card className="bg-white rounded-2xl shadow-2xl border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        {getSystemIcon(selected.systeme)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Détails de la notification</h2>
                        <p className="text-orange-100 text-sm mt-1">{selected.systeme}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-gray-800 leading-relaxed">{selected.contenu}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-orange-400 rounded-full" />
                    Reçue le {new Date(selected.dateNotification).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setSelected(null)}
                      className="flex-1"
                    >
                      Fermer
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteNotification(selected.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600"
                      disabled={deleting === selected.id}
                    >
                      {deleting === selected.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Suppression...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}