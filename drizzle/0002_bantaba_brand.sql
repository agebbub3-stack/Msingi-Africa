UPDATE "user"
SET name = 'Redação Bantaba Africa', updated_at = now()
WHERE id = 'msingi-editorial' AND name = 'Redação Msingi Africa';

UPDATE creator_profiles
SET display_name = 'Redação Bantaba Africa', updated_at = now()
WHERE user_id = 'msingi-editorial' AND display_name = 'Redação Msingi Africa';

UPDATE entities
SET name = 'Bantaba Africa',
    description = 'Grupo editorial e de pesquisa independente dedicado a pessoas, ideias e mercados africanos.',
    updated_at = now()
WHERE slug = 'msingi-africa' AND type = 'organization' AND name = 'Msingi Africa';

UPDATE entities
SET name = 'Bantaba Creator Plus', updated_at = now()
WHERE slug = 'creator-plus' AND name = 'Msingi Creator Plus';

UPDATE articles
SET body_markdown = replace(body_markdown, 'Msingi Africa', 'Bantaba Africa'),
    editorial_author = replace(editorial_author, 'Redação Msingi', 'Redação Bantaba'),
    seo_title = replace(seo_title, 'Msingi Africa', 'Bantaba Africa'),
    seo_description = replace(seo_description, 'Msingi Africa', 'Bantaba Africa'),
    seo_keywords = array_replace(seo_keywords, 'Msingi Africa', 'Bantaba Africa'),
    updated_at = now()
WHERE author_id = 'msingi-editorial'
  AND (body_markdown LIKE '%Msingi Africa%'
    OR editorial_author LIKE '%Redação Msingi%'
    OR seo_title LIKE '%Msingi Africa%'
    OR seo_description LIKE '%Msingi Africa%'
    OR 'Msingi Africa' = ANY(seo_keywords));
