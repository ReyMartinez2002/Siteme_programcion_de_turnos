"""Initial migration - create panpaya_stores and riders tables

Revision ID: 001
Revises: 
Create Date: 2025-12-27 21:07:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create panpaya_stores table
    op.create_table(
        'panpaya_stores',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('code', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('zone', sa.String(), nullable=True),
        sa.Column('address', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_panpaya_stores_code'), 'panpaya_stores', ['code'], unique=True)
    op.create_index(op.f('ix_panpaya_stores_id'), 'panpaya_stores', ['id'], unique=False)

    # Create riders table
    op.create_table(
        'riders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=False),
        sa.Column('rider_type', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_riders_id'), 'riders', ['id'], unique=False)


def downgrade() -> None:
    # Drop riders table
    op.drop_index(op.f('ix_riders_id'), table_name='riders')
    op.drop_table('riders')
    
    # Drop panpaya_stores table
    op.drop_index(op.f('ix_panpaya_stores_id'), table_name='panpaya_stores')
    op.drop_index(op.f('ix_panpaya_stores_code'), table_name='panpaya_stores')
    op.drop_table('panpaya_stores')
