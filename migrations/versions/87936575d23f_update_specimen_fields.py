"""update specimen fields

Revision ID: 87936575d23f
Revises: fc4ce98c74b4
Create Date: 2018-06-16 15:52:11.602343

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '87936575d23f'
down_revision = 'fc4ce98c74b4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('specimen', sa.Column('comments', sa.String(length=1024), nullable=True))
    op.alter_column('specimen', 'dna',
               existing_type=postgresql.DOUBLE_PRECISION(precision=53),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('specimen', 'dna',
               existing_type=postgresql.DOUBLE_PRECISION(precision=53),
               nullable=True)
    op.drop_column('specimen', 'comments')
    # ### end Alembic commands ###
