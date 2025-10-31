'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  PaperAirplaneIcon, 
  MagnifyingGlassIcon, 
  PaperClipIcon,
  FaceSmileIcon,
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image'

interface Message {
  id: number;
  sender: "agent" | "client";
  content: string;
  time: string;
}

interface Client {
  name: string;
  avatar: string;
  phone: string;
  email: string;
  status: string;
  budget: string;
  criteria: string;
}

interface Conversation {
  id: number;
  client: Client;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  messages: Message[];
}


export default function MessagerieAgent() {
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [message, setMessage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showClientInfo, setShowClientInfo] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Données de démonstration
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      client: {
        name: 'Marie Dubois',
        avatar: '/api/placeholder/40/40',
        phone: '06 12 34 56 78',
        email: 'marie.dubois@email.com',
        status: 'En recherche',
        budget: '250 000 - 300 000€',
        criteria: 'Appartement 3 pièces, Paris 15e'
      },
      lastMessage: 'Merci pour les photos, je suis très intéressée par la visite !',
      timestamp: '14:30',
      unread: 2,
      online: true,
      messages: [
        { id: 1, sender: 'client', content: 'Bonjour, j\'aimerais visiter l\'appartement rue de la Paix', time: '14:20' },
        { id: 2, sender: 'agent', content: 'Bonjour Marie, bien sûr ! Quand seriez-vous disponible ?', time: '14:22' },
        { id: 3, sender: 'client', content: 'Demain après-midi si possible ?', time: '14:25' },
        { id: 4, sender: 'agent', content: 'Parfait, je vous propose 15h. Voici quelques photos supplémentaires.', time: '14:28' },
        { id: 5, sender: 'client', content: 'Merci pour les photos, je suis très intéressée par la visite !', time: '14:30' }
      ]
    },
    {
      id: 2,
      client: {
        name: 'Jean Martin',
        avatar: '/api/placeholder/40/40',
        phone: '06 98 76 54 32',
        email: 'jean.martin@email.com',
        status: 'Acquéreur sérieux',
        budget: '400 000 - 500 000€',
        criteria: 'Maison avec jardin, banlieue'
      },
      lastMessage: 'D\'accord pour la visite de demain',
      timestamp: '12:45',
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: 'client', content: 'Bonjour, avez-vous du nouveau ?', time: '12:30' },
        { id: 2, sender: 'agent', content: 'Bonjour Jean ! Oui, j\'ai une nouvelle maison qui pourrait vous intéresser', time: '12:35' },
        { id: 3, sender: 'client', content: 'D\'accord pour la visite de demain', time: '12:45' }
      ]
    },
    {
      id: 3,
      client: {
        name: 'Sophie Lambert',
        avatar: '/api/placeholder/40/40',
        phone: '06 11 22 33 44',
        email: 'sophie.lambert@email.com',
        status: 'Premier contact',
        budget: '180 000 - 220 000€',
        criteria: 'Studio ou 2 pièces, centre-ville'
      },
      lastMessage: 'Merci pour votre réponse rapide',
      timestamp: 'Hier',
      unread: 0,
      online: true,
      messages: [
        { id: 1, sender: 'client', content: 'Bonjour, je recherche un petit appartement', time: 'Hier 16:20' },
        { id: 2, sender: 'agent', content: 'Bonjour Sophie, quel est votre budget ?', time: 'Hier 16:25' },
        { id: 3, sender: 'client', content: 'Merci pour votre réponse rapide', time: 'Hier 16:30' }
      ]
    }
  ]);

  const filteredConversations = conversations.filter(conv =>
    conv.client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: "agent",
      content: message,
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedChat.id
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: message,
              timestamp: "À l'instant",
            }
          : conv
      )
    );

    setSelectedChat(prev =>
      prev ? { ...prev, messages: [...prev.messages, newMessage] } : prev
    );

    setMessage('');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messagerie</h1>
              <p className="text-sm text-gray-600">Gérez vos conversations avec vos clients</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              Nouvelle conversation
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border h-[calc(100vh-200px)] flex">
          
          {/* Liste des conversations */}
          <div className="w-1/3 border-r flex flex-col">
            {/* Barre de recherche */}
            <div className="p-4 border-b">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une conversation..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Liste des conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedChat?.id === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => setSelectedChat(conv)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Image
                        src={conv.client.avatar}
                        alt={conv.client.name}
                        className="w-12 h-12 rounded-full"
                      />
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {conv.client.name}
                        </h3>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500">{conv.timestamp}</span>
                          {conv.unread > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 mt-1">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conv.lastMessage}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          conv.client.status === 'Acquéreur sérieux' 
                            ? 'bg-green-100 text-green-800'
                            : conv.client.status === 'En recherche'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {conv.client.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone de chat */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Header du chat */}
                <div className="p-4 border-b bg-white flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Image
                        src={selectedChat.client.avatar}
                        alt={selectedChat.client.name}
                        className="w-10 h-10 rounded-full"
                      />
                      {selectedChat.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedChat.client.name}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedChat.online ? 'En ligne' : 'Hors ligne'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <PhoneIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <VideoCameraIcon className="h-5 w-5" />
                    </button>
                    <button 
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setShowClientInfo(!showClientInfo)}
                    >
                      <InformationCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  <div className="space-y-4">
                    {selectedChat.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender === 'agent'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-900 shadow-sm border'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === 'agent' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Zone de saisie */}
                <div className="p-4 bg-white border-t">
                  <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                    <div className="flex-1">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          type="button"
                          className="p-2 text-gray-500 hover:text-gray-700"
                        >
                          <PaperClipIcon className="h-5 w-5" />
                        </button>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tapez votre message..."
                          className="flex-1 p-2 border-0 resize-none focus:ring-0 focus:outline-none max-h-32"
                          rows={1}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(e);
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="p-2 text-gray-500 hover:text-gray-700"
                        >
                          <FaceSmileIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez une conversation</h3>
                  <p className="text-gray-500">Choisissez un client dans la liste pour commencer à discuter</p>
                </div>
              </div>
            )}
          </div>

          {/* Panel d'informations client */}
          {showClientInfo && selectedChat && (
            <div className="w-80 border-l bg-white p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Informations client</h3>
                <button 
                  onClick={() => setShowClientInfo(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Photo et nom */}
                <div className="text-center">
                  <Image
                    src={selectedChat.client.avatar}
                    alt={selectedChat.client.name}
                    className="w-16 h-16 rounded-full mx-auto mb-3"
                  />
                  <h4 className="text-lg font-semibold text-gray-900">{selectedChat.client.name}</h4>
                  <p className={`text-sm px-3 py-1 rounded-full inline-block mt-2 ${
                    selectedChat.client.status === 'Acquéreur sérieux' 
                      ? 'bg-green-100 text-green-800'
                      : selectedChat.client.status === 'En recherche'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedChat.client.status}
                  </p>
                </div>

                {/* Coordonnées */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Contact</h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedChat.client.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{selectedChat.client.email}</span>
                    </div>
                  </div>
                </div>

                {/* Critères de recherche */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Recherche</h5>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Budget:</span>
                      <span className="ml-2">{selectedChat.client.budget}</span>
                    </div>
                    <div>
                      <span className="font-medium">Critères:</span>
                      <span className="ml-2">{selectedChat.client.criteria}</span>
                    </div>
                  </div>  
                </div>
 
                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                    Planifier une visite
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200">
                    Voir le profil complet
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}