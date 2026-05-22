import React from 'react'
import Button from '../ui/Button'
import './PagesHeader.scss'
const PagesHeader = ({
  title = '',
  buttonText = '',
  onClick,
  buttonClass = '',
  showButton = true,
  backico = ''
}) => {
  return (
    <header className='pages-header'>
      <h2 className='pages-title'>{title}</h2>

      {showButton && (
        <Button
          backico={backico}
          text={buttonText}
          className={buttonClass}
          onClick={onClick}
        />
      )}
    </header>
  )
}

export default PagesHeader