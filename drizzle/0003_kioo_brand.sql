UPDATE "user"
SET name = 'Redação Kioo Africa', updated_at = now()
WHERE id = 'msingi-editorial' AND name = 'Redação Bantaba Africa';

UPDATE creator_profiles
SET display_name = 'Redação Kioo Africa', updated_at = now()
WHERE user_id = 'msingi-editorial' AND display_name = 'Redação Bantaba Africa';

UPDATE entities
SET name = 'Kioo Africa',
    description = 'Grupo editorial e de pesquisa independente dedicado a pessoas, ideias e mercados africanos.',
    updated_at = now()
WHERE slug = 'msingi-africa' AND type = 'organization' AND name = 'Bantaba Africa';

UPDATE entities
SET name = 'Kioo Creator Plus', updated_at = now()
WHERE slug = 'creator-plus' AND name = 'Bantaba Creator Plus';

UPDATE articles
SET body_markdown = replace(body_markdown, 'Bantaba Africa', 'Kioo Africa'),
    editorial_author = replace(editorial_author, 'Bantaba', 'Kioo'),
    seo_title = replace(seo_title, 'Bantaba Africa', 'Kioo Africa'),
    seo_description = replace(seo_description, 'Bantaba Africa', 'Kioo Africa'),
    seo_keywords = array_replace(seo_keywords, 'Bantaba Africa', 'Kioo Africa'),
    updated_at = now()
WHERE author_id = 'msingi-editorial'
  AND (body_markdown LIKE '%Bantaba Africa%'
    OR editorial_author LIKE '%Bantaba%'
    OR seo_title LIKE '%Bantaba Africa%'
    OR seo_description LIKE '%Bantaba Africa%'
    OR 'Bantaba Africa' = ANY(seo_keywords));
