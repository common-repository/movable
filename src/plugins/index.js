/**
 * External Dependencies
 */
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

 /**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { BlockIcon, Inserter } from '@wordpress/block-editor';
import { __experimentalGetBlockLabel as getBlockLabel, getBlockType } from '@wordpress/blocks';
import { BaseControl, Button } from '@wordpress/components';
import { dispatch, select } from '@wordpress/data';
const { clearSelectedBlock, duplicateBlocks, moveBlockToPosition, removeBlock, selectBlock } = dispatch( 'core/block-editor' );
const { getBlockRootClientId } = select( 'core/block-editor' );
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

 /**
 * Internal Dependencies
 */
import './editor.scss';

const grid = 6;

const getItemStyle = ( isDragging, draggableStyle ) => ( {
	// some basic styles to make the items look a bit nicer
	userSelect: "none",
	padding: grid,
	margin: `0 0 ${ grid }px 0`,
	borderRadius: 2,
	border: isDragging ? '1px solid #007cba': '1px solid rgba(30,30,30, .3)',
	// change background colour if dragging
	background: isDragging ? "#007cba" : "#fff",
	background: isDragging ? "#fff" : "#fff",
	color: isDragging ? "#007cba" : "",
	// styles we need to apply on draggables
	...draggableStyle
} );

const getListStyle = isDraggingOver => ( {
	background: isDraggingOver ? "lightblue" : "#fff",
	background: isDraggingOver ? "#fff" : "#fff",
	padding: 0,
	paddingBottom:1,
	width: 250
} );
 
const Movable = ( props ) => {
	const {
		rootBlocks,
	} = props;

	// add some block data and an id for drag and drop
	let blocks = rootBlocks.map( ( block ) => {
		block.id = `${ block.clientId }`;
		return block;
	} );

	const onDragEnd = ( result ) => {
		const {
			draggableId: clientId,
		} = result;

		const fromRootClientId = getBlockRootClientId( clientId );

		// dropped outside the list
		if ( !result.destination ) {
			return;
		}

		moveBlockToPosition( clientId, fromRootClientId, '', result.destination.index );
	}

	return(
    <PluginDocumentSettingPanel
			name="custom-panel"
			title={ __( 'Drag & Drop', 'movable' ) }
			text="text"
			className="custom-panel"
    >
			<BaseControl  
				label={ __( 'Drag, Drop, Duplicate, Delete, Select & Insert blocks from the sidebar.', 'movable' ) }
			/>
      <DragDropContext onDragEnd={ onDragEnd }>
				<Droppable droppableId="droppable">
          { ( provided, snapshot ) => (
            <div
              { ...provided.droppableProps }
              ref={ provided.innerRef }
              style={ getListStyle( snapshot.isDraggingOver ) }
            >
							{
								blocks.map( ( block, index ) => {
									const blockType = getBlockType( block.name );

									return(
										<Draggable key={ block.id } draggableId={ block.id } index={ index }>
											{ ( provided, snapshot ) => (
												<div
													onClick={ () => {
														selectBlock( block.id );
													}}
													onMouseOver={ () => {
														const hoverBlock = document.querySelector(`#block-${ block.id }`);
														hoverBlock.classList.add('hover:movable');
													} }
													onMouseOut={ () => {
														const hoverBlock = document.querySelector( `#block-${ block.id }` );
														hoverBlock.classList.remove( 'hover:movable' );
													} }
													ref={ provided.innerRef }
													{ ...provided.draggableProps }
													{ ...provided.dragHandleProps }
													style={ getItemStyle(
														snapshot.isDragging,
														provided.draggableProps.style
													) }
												>
													<div className="movable">
														<div className="flex justify-between">
															<div className="w-3/4 items-center flex">
															<BlockIcon icon={ blockType.icon } showColors />
																<p className="mb-0 ml-1">{ getBlockLabel( blockType, block.attributes ) }</p>
															</div>
															<div className="flex justify-end">
																<Button 
																	label={ __( 'Duplicate', 'movable' ) }
																	onClick={ ( e ) => {
																		e.stopPropagation();
																		duplicateBlocks( [ block.id ] );
																		clearSelectedBlock();
																	} }
																	className="invisible hover:opacity-100"
																	icon="admin-page"></Button>	
																<Button 
																	label={ __( 'Delete', 'movable' ) }
																	onClick={ ( e ) => {
																		e.stopPropagation();
																		removeBlock( block.id );
																		clearSelectedBlock();
																	} }
																	className="invisible hover:opacity-100"
																	icon="no-alt"
																/>
															</div>													
														</div>
													</div>
												</div>
											)}
										</Draggable>
									)
								} )
							}
              { provided.placeholder }
            </div>
          ) }
        </Droppable>
			</DragDropContext>
			<div className="movable">
				<div className="text-center">
					<Inserter __experimentalSelectBlockOnInsert={ false } />
				</div>				
			</div>			
    </PluginDocumentSettingPanel>
	) 
};

const MovableWithCompose = compose(
	[
		withSelect( ( select, props ) => {
			const {
				getBlocks,
			} = select( 'core/block-editor' );

			return {
				rootBlocks: getBlocks(),
			};
		} ),
	]
)( Movable );


const name = 'movable';
const settings = {
	icon: '',
	render: MovableWithCompose,
}

export { name, settings };
