import { useState } from 'react';
import LoginPerpustakaan from './LoginPerpustakaan';
import DashboardPerpustakaan from './DashboardPerpustakaan';

type StudentData = {
  nisn: string;
  nama: string;
  kelas: string;
};

interface PerpustakaanAppProps {
  onClose?: () => void;
}

export default function PerpustakaanApp({ onClose }: PerpustakaanAppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  const handleLoginSuccess = (data: StudentData) => {
    setStudentData(data);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setStudentData(null);
  };

  const handleBackToPortal = () => {
    if (onClose) {
      onClose();
    } else {
      window.location.href = '/';
    }
  };

  if (!isLoggedIn) {
    return (
      <LoginPerpustakaan
        onLoginSuccess={handleLoginSuccess}
        onBackToPortal={handleBackToPortal}
      />
    );
  }

  return (
    <DashboardPerpustakaan
      studentData={studentData!}
      onLogout={handleLogout}
      onBackToPortal={handleBackToPortal}
    />
  );
}