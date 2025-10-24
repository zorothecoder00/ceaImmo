'use client'

import React, { useState } from 'react';
import { Mail, ArrowRight, Building2, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from "next/link"

// Définition du type pour nos erreurs
type Errors = {
  email?: string
  password?: string
  general?: string
}   

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({}) // ✅ Typage;
  const [resetMethod, setResetMethod] = useState('email'); // 'email' or 'google'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({ ...errors, email: undefined }); // ✅ On enlève juste l'erreur email
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {}; // ✅ On précise le type

    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Veuillez entrer un email valide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call for password reset
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Password reset requested for:', email);
      setIsEmailSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleReset = () => {
    // Simulate Google account recovery
    console.log('Google account recovery initiated');
    alert('Redirection vers la récupération de compte Google...');
  };

  const resendEmail = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Resending password reset email for:', email);
      alert('Email de réinitialisation renvoyé !');
    } catch (error) {
      console.error('Resend email error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Email envoyé !</h1>
              <p className="text-gray-600">
                Nous avons envoyé un lien de réinitialisation à
              </p>
              <p className="text-blue-600 font-medium mt-1">{email}</p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Étapes suivantes :</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>1. Vérifiez votre boîte de réception</li>
                <li>2. Cliquez sur le lien dans l&apos;email</li>
                <li>3. Créez votre nouveau mot de passe</li>
              </ul>
            </div>

            {/* Resend Email */}
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-3">Vous n&apos;avez pas reçu l&apos;email ?</p>
              <button
                onClick={resendEmail}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? 'Envoi en cours...' : 'Renvoyer l\'email'}
              </button>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/auth/login"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                Retour à la connexion
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <button
                onClick={() => setIsEmailSent(false)}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Essayer avec un autre email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mot de passe oublié ?</h1>
          <p className="text-gray-600">Pas de souci, nous allons vous aider à récupérer votre compte</p>
        </div>

        {/* Reset Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Comment souhaitez-vous récupérer votre compte ?
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="resetMethod"
                    value="email"
                    checked={resetMethod === 'email'}
                    onChange={(e) => setResetMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-gray-700">
                    <span className="font-medium">Via email</span>
                    <span className="block text-sm text-gray-500">Recevoir un lien de réinitialisation par email</span>
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="resetMethod"
                    value="google"
                    checked={resetMethod === 'google'}
                    onChange={(e) => setResetMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-gray-700">
                    <span className="font-medium">Compte Google</span>
                    <span className="block text-sm text-gray-500">Récupérer via votre compte Google</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Email Method */}
            {resetMethod === 'email' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="votre@email.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  <p className="mt-2 text-sm text-gray-500">
                    Entrez l&apos;email associé à votre compte pour recevoir un lien de réinitialisation.
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer le lien de réinitialisation
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </>
            )}

            {/* Google Method */}
            {resetMethod === 'google' && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Récupération via Google</h3>
                  <p className="text-sm text-gray-700">
                    Si vous vous êtes inscrit avec Google, vous pouvez récupérer votre compte directement via Google.
                  </p>
                </div>
                
                <button
                  onClick={handleGoogleReset}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Récupérer via Google
                </button>
              </div>
            )}
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link 
              href="/auth/login" 
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 mb-2">
            Vous rencontrez toujours des difficultés ?
          </p>
          <Link 
            href="/contact" 
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Contactez notre support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;