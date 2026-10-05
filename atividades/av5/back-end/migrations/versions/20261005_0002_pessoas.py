"""Add registered people for authentication."""

from alembic import op
import sqlalchemy as sa

revision = "20261005_0002"
down_revision = "20261005_0001"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "pessoas",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(length=200), nullable=False),
        sa.Column("email", sa.String(length=254), nullable=False),
        sa.Column("telefone", sa.String(length=30), nullable=True),
        sa.Column("login", sa.String(length=50), nullable=False),
        sa.Column("senha_hash", sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("login"),
    )


def downgrade():
    op.drop_table("pessoas")