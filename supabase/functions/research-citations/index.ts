
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, format = 'apa' } = await req.json();

    if (!query) {
      throw new Error('Query is required');
    }

    // Search CrossRef API for academic papers
    const searchUrl = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=10&sort=relevance`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'GlobalMedHub/1.0 (mailto:support@globalmedhub.com)',
      },
    });

    if (!response.ok) {
      throw new Error(`CrossRef API error: ${response.status}`);
    }

    const data = await response.json();
    const works = data.message.items;

    const citations = works.map((work: any) => {
      const authors = work.author?.map((author: any) => 
        `${author.given || ''} ${author.family || ''}`.trim()
      ).join(', ') || 'Unknown Author';
      
      const title = work.title?.[0] || 'Untitled';
      const journal = work['container-title']?.[0] || '';
      const year = work.published?.['date-parts']?.[0]?.[0] || '';
      const doi = work.DOI || '';
      const url = work.URL || (doi ? `https://doi.org/${doi}` : '');

      // Generate different citation formats
      let citation = '';
      if (format === 'apa') {
        citation = `${authors} (${year}). ${title}. ${journal}. ${doi ? `https://doi.org/${doi}` : ''}`;
      } else if (format === 'mla') {
        citation = `${authors}. "${title}" ${journal}, ${year}. ${doi ? `DOI: ${doi}` : ''}`;
      } else if (format === 'chicago') {
        citation = `${authors}. "${title}" ${journal} (${year}). ${doi ? `https://doi.org/${doi}` : ''}`;
      }

      return {
        id: work.DOI || crypto.randomUUID(),
        title,
        authors,
        journal,
        year,
        doi,
        url,
        citation: citation.trim(),
        abstract: work.abstract || '',
        type: work.type || 'journal-article'
      };
    });

    return new Response(JSON.stringify({ citations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in research-citations function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
