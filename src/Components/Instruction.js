import React from 'react'
import CardItem from './CardItem';

function Instruction() {
    return (
        <div className='cards'>
            <h2> Instruction to Create and sell your NFTs!</h2>
            <div className='cards__container'>
                <div className='cards__wrapper'>
                    <ul className='cards__items'>
                        <CardItem
                            src='https://the-defiant-web.s3.amazonaws.com/img/2022/03/24191104/MaskToken.jpg'
                            text='Once you’ve set up your wallet of choice, connect it to OpenSea by clicking the wallet icon in the top right corner. Learn about thewallets we support.'
                            label='Set up ypur wallet'
                            path='/services'
                        />
                        <CardItem
                            src='https://images-na.ssl-images-amazon.com/images/I/711sWGM74dS.jpg'
                            text='Click My Collections and set up your collection. Add social links, a description, profile & banner images, and set a secondary sales fee.'
                            label='Create your collection'
                            path='/services'
                        />
                    </ul>
                    <ul className='cards__items'>
                        <CardItem
                            src='https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg'
                            text='Upload your work (image, video, audio, or 3D art), add a title and description, and customize your NFTs with properties, stats, and unlockable content.'
                            label='Add your NFTs'
                            path='/services'
                        />

                        <CardItem
                            src='https://img.freepik.com/free-vector/red-sale-price-tag-style-banner-design-template_1017-27328.jpg?w=2000'
                            text='Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell your NFTs, and we help you sell them!'
                            label='List them for sale'
                            path='/services'
                        />

                    </ul>

                </div>
            </div>
        </div>

    )
}

export default Instruction