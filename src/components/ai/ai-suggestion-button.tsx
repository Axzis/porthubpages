'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiTextSuggestionsForLandingPage, AiTextSuggestionsForLandingPageInput, AiTextSuggestionsForLandingPageOutput } from '@/ai/flows/ai-text-suggestions';

interface AiSuggestionButtonProps {
  pagePurpose: string;
  onSuggestions: (suggestions: AiTextSuggestionsForLandingPageOutput) => void;
}

export function AiSuggestionButton({ pagePurpose, onSuggestions }: AiSuggestionButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getSuggestions = async () => {
    if (!pagePurpose) {
      toast({
        variant: 'destructive',
        title: 'Page Purpose Required',
        description: 'Please describe the purpose of your page in the settings first.',
      });
      return;
    }
    setLoading(true);
    try {
      const input: AiTextSuggestionsForLandingPageInput = { pagePurpose };
      const result = await aiTextSuggestionsForLandingPage(input);
      onSuggestions(result);
      toast({ title: 'Suggestions generated!' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Failed to get suggestions', description: 'Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={getSuggestions} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      <span className="ml-2 hidden sm:inline">AI Suggest</span>
    </Button>
  );
}
