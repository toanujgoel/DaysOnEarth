
import React, { useState } from 'react';
import type { UserData, Gender, ActivityLevel, Diet } from '../types';

interface UserInputFormProps {
  onCalculate: (data: UserData) => void;
  isLoading: boolean;
}

export const UserInputForm: React.FC<UserInputFormProps> = ({ onCalculate, isLoading }) => {
  const [birthdate, setBirthdate] = useState('');
  const [country, setCountry] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [diet, setDiet] = useState<Diet>('omnivore');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!birthdate || !country || !height || !weight) {
      setError('Please fill out all fields.');
      return;
    }
    
    if (new Date(birthdate) > new Date()) {
      setError('Birthdate cannot be in the future.');
      return;
    }

    onCalculate({
      birthdate,
      country,
      height: parseFloat(height),
      weight: parseFloat(weight),
      gender,
      activityLevel,
      diet,
    });
  };

  return (
    <div className="bg-brand-forest/50 p-6 rounded-xl border border-brand-moss/50 shadow-lg sticky top-8">
      <h2 className="text-2xl font-bold text-brand-light-green mb-4">Your Journey Begins</h2>
      <p className="text-brand-stone mb-6">Enter your details to unlock deep analytics about your life.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="birthdate" className="block text-sm font-medium text-brand-stone">Birthdate</label>
          <input
            type="date"
            id="birthdate"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="mt-1 block w-full bg-brand-dark-green border border-brand-moss rounded-md shadow-sm py-2 px-3 text-brand-light-green focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-brand-stone">Country of Residence</label>
          <input
            type="text"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 block w-full bg-brand-dark-green border border-brand-moss rounded-md shadow-sm py-2 px-3 text-brand-light-green focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
            placeholder="e.g., United States"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-brand-stone">Gender</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="mt-1 block w-full bg-brand-dark-green border border-brand-moss rounded-md shadow-sm py-2 px-3 text-brand-light-green focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
             <div>
              <label htmlFor="activity" className="block text-sm font-medium text-brand-stone">Activity Level</label>
              <select
                id="activity"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="mt-1 block w-full bg-brand-dark-green border border-brand-moss rounded-md shadow-sm py-2 px-3 text-brand-light-green focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
              >
                <option value="sedentary">Sedentary</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
              </select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-brand-stone">Height (cm)</label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-1 block w-full bg-brand-dark-green border border-brand-moss rounded-md shadow-sm py-2 px-3 text-brand-light-green focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                placeholder="e.g., 175"
              />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-brand-stone">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1 block w-full bg-brand-dark-green border border-brand-moss rounded-md shadow-sm py-2 px-3 text-brand-light-green focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                placeholder="e.g., 70"
              />
            </div>
        </div>

        <div>
          <label htmlFor="diet" className="block text-sm font-medium text-brand-stone">Dietary Preference</label>
          <select
            id="diet"
            value={diet}
            onChange={(e) => setDiet(e.target.value as Diet)}
            className="mt-1 block w-full bg-brand-dark-green border border-brand-moss rounded-md shadow-sm py-2 px-3 text-brand-light-green focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
          >
            <option value="omnivore">Omnivore (Meat Eater)</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
          <p className="text-xs text-brand-stone mt-1">Used to estimate environmental impact.</p>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-accent hover:bg-green-400 disabled:bg-brand-moss text-brand-dark-green font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:scale-100 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Life...
            </>
          ) : (
            'Calculate My Journey'
          )}
        </button>
      </form>
    </div>
  );
};
