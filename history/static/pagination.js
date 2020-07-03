class Pagination {
    constructor(id, npages, currentPage=1, max = 5) {
        this.npages= npages ;
        this.currentPage = currentPage;
        this.paginationElement = document.getElementById(id);
        this.max = max;
    }

    createList() {
        this.createItem("Précédent", this.currentPage-1, false, this.currentPage==1)
        let max = this.max+this.currentPage>this.npages?this.npages+1:this.max+this.currentPage;
        for (var i=this.currentPage;i<max;i++)
            this.createItem(i, i, i==this.currentPage);
        this.createItem("Suivant", this.currentPage+1, false, this.currentPage==this.npages)
    }

    createItem(content, page, active=false, disabled=false) {
        var item = document.createElement('LI');
        var itemClass = 'page-item';
        if (active) itemClass+=' active'
        if (disabled) itemClass+=' disabled'
        item.setAttribute('class', itemClass);
        var link = document.createElement('A');
        link.setAttribute('class', 'page-link');
        link.setAttribute('href', '?page='+page);
        link.innerHTML = content;
        item.appendChild(link);
        this.paginationElement.appendChild(item);
    }
}