"""added country, state, city tables

Revision ID: e85fd112c609
Revises: d4fd58a9f0a7
Create Date: 2018-05-08 10:55:57.729831

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e85fd112c609'
down_revision = 'd4fd58a9f0a7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('country',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('alpha_code', sa.String(length=3), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('phone_code', sa.String(length=16), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('city',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('state_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['state_id'], ['country.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('state',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('country_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['country_id'], ['country.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('state')
    op.drop_table('city')
    op.drop_table('country')
    # ### end Alembic commands ###
