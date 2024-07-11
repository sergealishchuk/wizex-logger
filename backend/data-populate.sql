INSERT INTO
  public.users (
    "firstname",
    "lastname",
    "email",
    "contactemail",
    "password",
    "country",
    "phone",
    "address",
    "emailconfirmid",
    "passwordrecoverid",
    "passwordrecovertime",
    "emailconfirmed",
    "roles",
    "createdAt",
    "updatedAt"
  )
VALUES
  (
    'admin_name',
    'admin_lastname',
    'admin@admin.com',
    'admin@admin.com',
    '377b70656100361e49528c17a8ec867a',
    'UA',
    NULL,
    NULL,
    '123',
    NULL,
    NULL,
    true,
    '{user,seller,admin}',
    '2023-01-20T17:55:47.442Z',
    '2023-01-20T17:55:47.442Z'
  ),
  (
    'Serhii',
    'Alishchuk',
    'salischuk@gmail.com',
    'salischuk@gmail.com',
    '377b70656100361e49528c17a8ec867a',
    'UA',
    NULL,
    NULL,
    '123',
    NULL,
    NULL,
    true,
    '{user,seller,admin}',
    '2023-01-20T17:55:47.442Z',
    '2023-01-20T17:55:47.442Z'
  );

INSERT INTO
  public.categories (id, parentid, name, nameen, path, index, leaf)
VALUES
  (
    1,
    NULL,
    'Всі Категорії',
    'All Categories',
    NULL,
    0,
    false
  );

INSERT INTO
  public.sids ("userId")
VALUES
  (1),
  (2),
  (3),
  (4);

INSERT INTO
  public.articles (
    "id",
    "title",
    "body",
    "tags",
    "authorId",
    "lastEditorId",
    "createdAt",
    "updatedAt"
  )
VALUES
  (
    1,
    'Article 1',
    'Arcicle Body for 1',
    '{1,2,3}',
    3,
    3,
    '2023-01-20T17:55:47.442Z',
    '2023-03-20T17:55:47.442Z'
  ),
  (
    2,
    'Article 2',
    'Arcicle Body for 2',
    '{1,2}',
    3,
    3,
    '2023-02-20T17:55:47.442Z',
    '2023-01-20T17:55:47.442Z'
  ),
  (
    3,
    'Article 3',
    'Arcicle Body for 3',
    '{3}',
    3,
    3,
    '2023-03-20T17:55:47.442Z',
    '2023-04-20T17:55:47.442Z'
  );

INSERT INTO
  public.articles_tags ("id", "name", "index")
VALUES
  (1, 'my tag1', 1),
  (2, 'my tag2', 2),
  (3, 'my tag3', 3),
  (4, 'my tag4', 4);

INSERT INTO
  public.projects (
    id,
    name,
    description,
    "publicLink",
    "apiKey",
    "token",
    "active"
  )
VALUES
  (
    1,
    'ALIOKS',
    'Alioks Project',
    'https://alioks.com',
    '112233',
    'token1',
    false
  ),
  (
    2,
    'LM',
    'Leroy Merlin',
    'https://uat.leroymerlin.ua',
    'secure111',
    'token2',
    true
  );

INSERT INTO
  public.project_actions (
    id,
    "projectId",
    "level",
    "message",
    "content"
  )
VALUES
  (
    1,
    1,
    'error',
    'Add/edit product: Error from backend side: "CODE 123, Problem load image"',
    '{"message": "Add/edit product: Error from backend side"}'
  );

SELECT
  setval (
    'categories_id_seq',
    (
      SELECT
        max(id)
      FROM
        public.categories
    )
  );

SELECT
  setval (
    '"cicd_projects_id_seq"',
    (
      SELECT
        max("id")
      FROM
        public.cicd_projects
    )
  );

  SELECT
  setval (
    '"cicd_builds_id_seq"',
    (
      SELECT
        max("id")
      FROM
        public.cicd_builds
    )
  );