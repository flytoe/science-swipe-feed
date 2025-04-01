
import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { 
  getMindBlowCount, 
  hasUserMindBlown, 
  addMindBlow, 
  removeMindBlow, 
  isTopMindBlownPaper 
} from '../lib/mindBlowService';

// For now, we'll use a simple temporary user ID
// In a real app, this would come from authentication
const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem('temp_user_id');
  if (!userId) {
    userId = `temp_user_${nanoid()}`;
    localStorage.setItem('temp_user_id', userId);
  }
  return userId;
};

export function useMindBlow(paperDoi: string) {
  const [count, setCount] = useState<number>(0);
  const [hasMindBlown, setHasMindBlown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTopPaper, setIsTopPaper] = useState<boolean>(false);
  const userId = getOrCreateUserId();

  const fetchMindBlowData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [mindBlowCount, userHasMindBlown, topPaper] = await Promise.all([
        getMindBlowCount(paperDoi),
        hasUserMindBlown(paperDoi, userId),
        isTopMindBlownPaper(paperDoi)
      ]);
      
      setCount(mindBlowCount);
      setHasMindBlown(userHasMindBlown);
      setIsTopPaper(topPaper);
    } catch (error) {
      console.error('Error fetching mind blow data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [paperDoi, userId]);

  useEffect(() => {
    if (paperDoi) {
      fetchMindBlowData();
    }
  }, [paperDoi, fetchMindBlowData]);

  const toggleMindBlow = useCallback(async (reason?: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      let success;
      
      if (hasMindBlown) {
        success = await removeMindBlow(paperDoi, userId);
        if (success) {
          setCount(prev => Math.max(prev - 1, 0));
          setHasMindBlown(false);
        }
      } else {
        success = await addMindBlow(paperDoi, userId, reason);
        if (success) {
          setCount(prev => prev + 1);
          setHasMindBlown(true);
          // Check if this addition makes it a top paper
          const newIsTop = await isTopMindBlownPaper(paperDoi);
          setIsTopPaper(newIsTop);
        }
      }
    } catch (error) {
      console.error('Error toggling mind blow:', error);
    } finally {
      setIsLoading(false);
    }
  }, [paperDoi, userId, hasMindBlown, isLoading]);

  return {
    count,
    hasMindBlown,
    isLoading,
    isTopPaper,
    toggleMindBlow,
    refresh: fetchMindBlowData
  };
}
