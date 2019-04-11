import React, {Component} from 'react'
import {Link} from 'react-router-dom'


class Pagination extends Component {

    render() {
        const {next, previous} = this.props
        const nextLink = next ? next.split('?') : ''
        const prevLink = previous ? previous.split('?') : ''
        const activeLink = 'page-item'
        const disableLink = 'page-item disabled'

        if (!this.props.count) {
            return (
                <div class="alert alert-primary" role="alert">No articles yet</div>
            )
        }
        
        return (
            <div>
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-start">
                        
                        <li className={prevLink !== '' ? activeLink : disableLink}>
                            <Link to={{pathname: '/', search: prevLink !== '' && prevLink[1]}} className="page-link" ><span aria-hidden="true">&laquo;</span></Link>
                        </li>
                        <li className={nextLink !== '' ? activeLink : disableLink}>
                            <Link to={{pathname: '/', search: nextLink !== '' && nextLink[1]}} className="page-link" ><span aria-hidden="true">&raquo;</span></Link>
                        </li>
                        
                    </ul>
                </nav>
            </div>
        )
    }
}

export default Pagination