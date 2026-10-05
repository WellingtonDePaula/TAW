"""Create games and genres tables."""

from alembic import op
import sqlalchemy as sa

revision = "20261005_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "generos",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("nome"),
    )
    op.create_table(
        "jogos",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(length=200), nullable=False),
        sa.Column("descricao", sa.Text(), nullable=False),
        sa.Column("banner", sa.String(length=2048), nullable=False),
        sa.Column("preco_base", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("preco_ofertado", sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column("distribuidora", sa.String(length=200), nullable=False),
        sa.Column("desenvolvedora", sa.String(length=200), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "jogos_generos",
        sa.Column("jogo_id", sa.Integer(), nullable=False),
        sa.Column("genero_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["genero_id"], ["generos.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["jogo_id"], ["jogos.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("jogo_id", "genero_id"),
    )


def downgrade():
    op.drop_table("jogos_generos")
    op.drop_table("jogos")
    op.drop_table("generos")