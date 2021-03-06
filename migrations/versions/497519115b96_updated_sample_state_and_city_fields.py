"""updated sample state and city fields

Revision ID: 497519115b96
Revises: a18fbc953082
Create Date: 2018-06-17 15:03:28.765962

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '497519115b96'
down_revision = 'a18fbc953082'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('sample_origin_city_fkey', 'sample', type_='foreignkey')
    op.drop_constraint('sample_origin_state_fkey', 'sample', type_='foreignkey')
    op.drop_column('sample', 'origin_city')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('sample', sa.Column('origin_city', sa.INTEGER(), autoincrement=False, nullable=True))
    op.create_foreign_key('sample_origin_state_fkey', 'sample', 'state', ['origin_state'], ['id'])
    op.create_foreign_key('sample_origin_city_fkey', 'sample', 'city', ['origin_city'], ['id'])
    # ### end Alembic commands ###
