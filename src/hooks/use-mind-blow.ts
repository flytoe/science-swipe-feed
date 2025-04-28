
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

export function useMindBlow(paperId: string) {
  const [count, setCount] = useState<number>(0);
  const [hasMindBlown, setHasMindBlown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTopPaper, setIsTopPaper] = useState<boolean>(false);
  const userId = getOrCreateUserId();

  const fetchMindBlowData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Convert numeric paperId to string if needed
      const id = typeof paperId === 'number' ? paperId.toString() : paperId;
      
      const [mindBlowCount, userHasMindBlown, topPaper] = await Promise.all([
        getMindBlowCount(id),
        hasUserMindBlown(id, userId),
        isTopMindBlownPaper(id)
      ]);
      
      setCount(mindBlowCount);
      setHasMindBlown(userHasMindBlown);
      setIsTopPaper(topPaper);
    } catch (error) {
      console.error('Error fetching mind blow data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [paperId, userId]);

  useEffect(() => {
    if (paperId) {
      fetchMindBlowData();
    }
  }, [paperId, fetchMindBlowData]);

  const toggleMindBlow = useCallback(async (reason?: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Convert numeric paperId to string if needed
      const id = typeof paperId === 'number' ? paperId.toString() : paperId;
      
      if (!hasMindBlown) {
        // Add a new mind blow
        const success = await addMindBlow(id, userId, reason);
        if (success) {
          setCount(prev => prev + 1);
          setHasMindBlown(true);
          // Check if this addition makes it a top paper
          const newIsTop = await isTopMindBlownPaper(id);
          setIsTopPaper(newIsTop);
        }
      } else if (hasMindBlown && reason) {
        // User is just adding a reason to an existing mind-blow
        // Remove the existing mind-blow and add a new one with the reason
        await removeMindBlow(id, userId);
        const success = await addMindBlow(id, userId, reason);
        if (success) {
          // Count stays the same since we're just updating the reason
          setHasMindBlown(true);
        }
      } else {
        // Remove mind blow (only if no reason is provided)
        const success = await removeMindBlow(id, userId);
        if (success) {
          setCount(prev => Math.max(prev - 1, 0));
          setHasMindBlown(false);
        }
      }
    } catch (error) {
      console.error('Error toggling mind blow:', error);
    } finally {
      setIsLoading(false);
    }
  }, [paperId, userId, hasMindBlown, isLoading]);

  return {
    count,
    hasMindBlown,
    isLoading,
    isTopPaper,
    toggleMindBlow,
    refresh: fetchMindBlowData
  };
}
