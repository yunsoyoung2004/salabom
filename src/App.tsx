import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { MedicalDataBridge } from './components/MedicalDataBridge'
import { Accommodation, AnalysisResult, Compare, Community, Home, Itinerary, LifestyleQuiz, MapPage, MyPage, Onboarding, RegionDetail, Splash } from './pages/Pages'

export default function App() {
  const [, setDataRevision] = useState(0)
  const refreshMedicalData = () => setDataRevision((revision) => revision + 1)
  return <BrowserRouter><AppProvider><MedicalDataBridge refresh={refreshMedicalData} /><Routes>
    <Route path="/" element={<Splash />} />
    <Route path="/onboarding" element={<Onboarding />} />
    <Route path="/lifestyle" element={<LifestyleQuiz />} />
    <Route path="/analysis-result" element={<AnalysisResult />} />
    <Route path="/home" element={<Home />} />
    <Route path="/compare" element={<Compare />} />
    <Route path="/region/:id" element={<RegionDetail />} />
    <Route path="/accommodation" element={<Accommodation />} />
    <Route path="/itinerary" element={<Itinerary />} />
    <Route path="/map" element={<MapPage />} />
    <Route path="/community" element={<Community />} />
    <Route path="/mypage" element={<MyPage />} />
  </Routes></AppProvider></BrowserRouter>
}
