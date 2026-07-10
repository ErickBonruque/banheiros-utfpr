-- ============================================================
-- V3 - Estrutura real dos campus
--   Santa Helena: Blocos L, K, M (salas de aula), Bloco E,
--                 Bloco de Apoio e Professores e Restaurante
--                 Universitario (convivencia).
--   Toledo:       Blocos A, C, E e Restaurante Universitario.
--   Cada localizacao possui banheiros Masculino, Feminino e PCD.
-- Substitui os dados de demonstracao da V2.
-- ============================================================

DELETE FROM comentario;
DELETE FROM insight;
DELETE FROM avaliacao;
DELETE FROM banheiro;
DELETE FROM localizacao;

-- ----------------------------------------------------------------
-- Localizacoes
-- ----------------------------------------------------------------
INSERT INTO localizacao (id, campus_id, tipo, nome, descricao, ativo) VALUES
    -- UTFPR Santa Helena (campus 1)
    (1,  1, 'BLOCO',  'Bloco L',                       'Salas de aula e departamentos',                          b'1'),
    (2,  1, 'BLOCO',  'Bloco K',                       'Salas de aula e Colecao Ictiologica (CISH)',             b'1'),
    (3,  1, 'BLOCO',  'Bloco M',                       'Salas de aula e departamentos',                          b'1'),
    (4,  1, 'BLOCO',  'Bloco E',                       'Nucleo NORTE e salas administrativas',                   b'1'),
    (5,  1, 'BLOCO',  'Bloco de Apoio e Professores',  'Almoxarifado, patrimonio e permanencia de docentes',     b'1'),
    (6,  1, 'PREDIO', 'Restaurante Universitario',     'Bloco de convivencia: RU e auditorios',                  b'1'),
    -- UTFPR Toledo (campus 2)
    (7,  2, 'BLOCO',  'Bloco A',                       'Salas de aula',                                          b'1'),
    (8,  2, 'BLOCO',  'Bloco C',                       'Salas de aula e laboratorios',                           b'1'),
    (9,  2, 'BLOCO',  'Bloco E',                       'Salas de aula e departamentos',                          b'1'),
    (10, 2, 'PREDIO', 'Restaurante Universitario',     'Restaurante universitario do campus',                    b'1');

-- ----------------------------------------------------------------
-- Banheiros: Masculino, Feminino e PCD em cada localizacao
-- ----------------------------------------------------------------
INSERT INTO banheiro (id, localizacao_id, identificador, andar, tipo, descricao, qtd_cabines, acessivel, ativo) VALUES
    -- Santa Helena · Bloco L
    (1,  1,  'Bloco L - Masculino', 0, 'M',   'Corredor central do bloco',        3, b'0', b'1'),
    (2,  1,  'Bloco L - Feminino',  0, 'F',   'Corredor central do bloco',        4, b'0', b'1'),
    (3,  1,  'Bloco L - PCD',       0, 'PCD', 'Ao lado da entrada principal',     1, b'1', b'1'),
    -- Santa Helena · Bloco K
    (4,  2,  'Bloco K - Masculino', 0, 'M',   'Proximo a Colecao Ictiologica',    3, b'0', b'1'),
    (5,  2,  'Bloco K - Feminino',  0, 'F',   'Proximo a Colecao Ictiologica',    4, b'0', b'1'),
    (6,  2,  'Bloco K - PCD',       0, 'PCD', 'Entrada lateral do bloco',         1, b'1', b'1'),
    -- Santa Helena · Bloco M
    (7,  3,  'Bloco M - Masculino', 0, 'M',   'Fim do corredor de salas',         3, b'0', b'1'),
    (8,  3,  'Bloco M - Feminino',  0, 'F',   'Fim do corredor de salas',         4, b'0', b'1'),
    (9,  3,  'Bloco M - PCD',       0, 'PCD', 'Ao lado da escada de acesso',      1, b'1', b'1'),
    -- Santa Helena · Bloco E
    (10, 4,  'Bloco E - Masculino', 0, 'M',   'Corredor administrativo',          2, b'0', b'1'),
    (11, 4,  'Bloco E - Feminino',  0, 'F',   'Corredor administrativo',          2, b'0', b'1'),
    (12, 4,  'Bloco E - PCD',       0, 'PCD', 'Ao lado do NORTE',                 1, b'1', b'1'),
    -- Santa Helena · Bloco de Apoio e Professores
    (13, 5,  'Bloco de Apoio - Masculino', 0, 'M',   'Proximo ao almoxarifado',   2, b'0', b'1'),
    (14, 5,  'Bloco de Apoio - Feminino',  0, 'F',   'Proximo ao almoxarifado',   2, b'0', b'1'),
    (15, 5,  'Bloco de Apoio - PCD',       0, 'PCD', 'Area de permanencia',       1, b'1', b'1'),
    -- Santa Helena · Restaurante Universitario
    (16, 6,  'RU - Masculino', 0, 'M',   'Entrada do refeitorio',                 4, b'0', b'1'),
    (17, 6,  'RU - Feminino',  0, 'F',   'Entrada do refeitorio',                 4, b'0', b'1'),
    (18, 6,  'RU - PCD',       0, 'PCD', 'Ao lado do auditorio fechado',          1, b'1', b'1'),
    -- Toledo · Bloco A
    (19, 7,  'Bloco A - Masculino', 0, 'M',   'Corredor de salas',                3, b'0', b'1'),
    (20, 7,  'Bloco A - Feminino',  0, 'F',   'Corredor de salas',                4, b'0', b'1'),
    (21, 7,  'Bloco A - PCD',       0, 'PCD', 'Entrada do bloco',                 1, b'1', b'1'),
    -- Toledo · Bloco C
    (22, 8,  'Bloco C - Masculino', 0, 'M',   'Proximo aos laboratorios',         3, b'0', b'1'),
    (23, 8,  'Bloco C - Feminino',  0, 'F',   'Proximo aos laboratorios',         4, b'0', b'1'),
    (24, 8,  'Bloco C - PCD',       0, 'PCD', 'Entrada do bloco',                 1, b'1', b'1'),
    -- Toledo · Bloco E
    (25, 9,  'Bloco E - Masculino', 0, 'M',   'Corredor de salas',                3, b'0', b'1'),
    (26, 9,  'Bloco E - Feminino',  0, 'F',   'Corredor de salas',                4, b'0', b'1'),
    (27, 9,  'Bloco E - PCD',       0, 'PCD', 'Entrada do bloco',                 1, b'1', b'1'),
    -- Toledo · Restaurante Universitario
    (28, 10, 'RU - Masculino', 0, 'M',   'Entrada do refeitorio',                 4, b'0', b'1'),
    (29, 10, 'RU - Feminino',  0, 'F',   'Entrada do refeitorio',                 4, b'0', b'1'),
    (30, 10, 'RU - PCD',       0, 'PCD', 'Entrada do refeitorio',                 1, b'1', b'1');

-- ----------------------------------------------------------------
-- Avaliacoes de demonstracao (datas relativas para o app estar
-- sempre "vivo"). Historias:
--   Banheiro 1  (Bloco L M, SH):  mediano, horarios variados (analise temporal)
--   Banheiro 2  (Bloco L F, SH):  bom e estavel
--   Banheiro 4  (Bloco K M, SH):  em tendencia de melhora
--   Banheiro 18 (RU PCD, SH):     excelente -> Trono de Ouro
--   Banheiro 13 (Apoio M, SH):    pessimo -> Zona de Risco
--   Banheiro 16 (RU M, SH):       movimentado no almoco
--   Banheiros 19 e 28 (Toledo):   avaliacoes esparsas
-- ----------------------------------------------------------------
INSERT INTO avaliacao (usuario_id, banheiro_id, limpeza, cheiro, papel_higienico, estado_portas, iluminacao, silencio, movimentacao, comentario, data_avaliacao, horario_avaliacao) VALUES
    -- Banheiro 1: mediano, avaliacoes em horarios variados
    (2, 1,  3, 3, 2, 4, 4, 2, 2, 'Muito movimento no intervalo',            CURDATE() - INTERVAL 14 DAY, '09:50:00'),
    (3, 1,  3, 2, 3, 4, 4, 2, 1, 'Fila na troca de aula',                   CURDATE() - INTERVAL 12 DAY, '10:05:00'),
    (2, 1,  4, 3, 3, 4, 4, 4, 4, 'De tarde fica bem tranquilo',             CURDATE() - INTERVAL 9 DAY,  '15:30:00'),
    (3, 1,  4, 4, 3, 4, 5, 5, 5, 'Vazio a noite, otimo',                    CURDATE() - INTERVAL 6 DAY,  '20:10:00'),
    (2, 1,  3, 3, 4, 4, 4, 4, 4, NULL,                                      CURDATE() - INTERVAL 2 DAY,  '16:45:00'),
    -- Banheiro 2: bom e estavel
    (3, 2,  4, 4, 4, 4, 4, 4, 3, 'Sempre limpo',                            CURDATE() - INTERVAL 10 DAY, '11:20:00'),
    (2, 2,  4, 4, 5, 4, 4, 3, 3, NULL,                                      CURDATE() - INTERVAL 5 DAY,  '13:40:00'),
    (3, 2,  4, 5, 4, 4, 5, 4, 4, 'Melhorou depois da manutencao',           CURDATE() - INTERVAL 1 DAY,  '10:15:00'),
    -- Banheiro 4: em tendencia de melhora
    (2, 4,  2, 2, 1, 2, 3, 3, 3, 'Sem papel de novo...',                    CURDATE() - INTERVAL 20 DAY, '08:30:00'),
    (3, 4,  2, 3, 2, 2, 3, 3, 3, NULL,                                      CURDATE() - INTERVAL 15 DAY, '14:00:00'),
    (2, 4,  4, 4, 4, 3, 4, 4, 4, 'Arrumaram as portas',                     CURDATE() - INTERVAL 4 DAY,  '09:10:00'),
    (3, 4,  4, 4, 5, 4, 4, 4, 4, 'Bem melhor agora',                        CURDATE() - INTERVAL 1 DAY,  '16:20:00'),
    -- Banheiro 18 (RU PCD, SH): excelente -> Trono de Ouro
    (2, 18, 5, 5, 5, 5, 5, 5, 5, 'O melhor banheiro do campus, disparado',  CURDATE() - INTERVAL 8 DAY,  '10:40:00'),
    (3, 18, 5, 5, 4, 5, 5, 5, 5, 'Silencioso e impecavel',                  CURDATE() - INTERVAL 3 DAY,  '15:00:00'),
    (2, 18, 5, 4, 5, 5, 5, 5, 5, NULL,                                      CURDATE() - INTERVAL 1 DAY,  '11:30:00'),
    -- Banheiro 13 (Apoio M, SH): pessimo -> Zona de Risco
    (2, 13, 1, 1, 1, 2, 2, 3, 2, 'Evitem, so em emergencia',                CURDATE() - INTERVAL 7 DAY,  '17:00:00'),
    (3, 13, 1, 1, 2, 1, 1, 2, 2, 'Porta nao fecha e nao tem papel',         CURDATE() - INTERVAL 2 DAY,  '18:30:00'),
    -- Banheiro 16 (RU M, SH): movimentado no horario do almoco
    (2, 16, 4, 3, 4, 4, 4, 2, 1, 'Lotado no almoco, fila na porta',         CURDATE() - INTERVAL 6 DAY,  '12:10:00'),
    (3, 16, 4, 4, 4, 4, 4, 2, 2, 'Meio-dia e impossivel',                   CURDATE() - INTERVAL 4 DAY,  '12:30:00'),
    (2, 16, 4, 4, 4, 4, 4, 5, 5, 'Fora do almoco e otimo',                  CURDATE() - INTERVAL 3 DAY,  '15:40:00'),
    -- Banheiro 19 (Bloco A M, Toledo)
    (3, 19, 3, 3, 3, 4, 4, 3, 3, 'Razoavel, podia ter mais papel',          CURDATE() - INTERVAL 5 DAY,  '10:20:00'),
    (2, 19, 4, 3, 4, 4, 4, 3, 3, NULL,                                      CURDATE() - INTERVAL 2 DAY,  '14:15:00'),
    -- Banheiro 28 (RU M, Toledo)
    (3, 28, 4, 4, 4, 4, 4, 3, 2, 'Movimentado mas bem cuidado',             CURDATE() - INTERVAL 3 DAY,  '12:20:00'),
    (2, 28, 4, 4, 5, 4, 4, 3, 3, NULL,                                      CURDATE() - INTERVAL 1 DAY,  '13:00:00');

-- Nota geral de cada avaliacao = media dos 7 criterios
UPDATE avaliacao
   SET nota_geral = (limpeza + cheiro + papel_higienico + estado_portas + iluminacao + silencio + movimentacao) / 7.0;

-- Estatisticas agregadas dos banheiros
UPDATE banheiro b
   SET nota_media = COALESCE((SELECT AVG(a.nota_geral) FROM avaliacao a WHERE a.banheiro_id = b.id), 0),
       total_avaliacoes = (SELECT COUNT(*) FROM avaliacao a WHERE a.banheiro_id = b.id);

INSERT INTO comentario (usuario_id, banheiro_id, texto, data_criacao) VALUES
    (2, 18, 'Dica: o PCD do RU sempre tem papel e sabonete.',                NOW() - INTERVAL 3 DAY),
    (3, 13, 'Alguem avisa a prefeitura do campus sobre o bloco de apoio?',   NOW() - INTERVAL 2 DAY),
    (2, 1,  'Evitem o intervalo das 9h50, fila enorme.',                     NOW() - INTERVAL 1 DAY),
    (3, 16, 'No almoco va no do Bloco L, o do RU fica lotado.',              NOW() - INTERVAL 1 DAY);
