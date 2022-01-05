import { Injectable } from "@angular/core";
import { Cart } from "../../models/cart";
import { ProdutoDTO } from "../../models/produto.dto";
import { StorageService } from "../storage.service";

@Injectable()
export class CartService {

    constructor(public storage: StorageService) {  
    }

    createOrClearCart() : Cart {
        let cart: Cart = {items: []};
        this.storage.setCart(cart);

        return cart; 
    }

    getCart() : Cart {
        let cart: Cart = this.storage.getCart();
        if(cart == null) {
            cart = this.createOrClearCart();
        }

        return cart;
    }

    addProdutoToCart(produto: ProdutoDTO) : Cart {
        let cart = this.getCart();
        let position = cart.items.findIndex(item => item.produto.id == produto.id);

        if(position == -1) {
            cart.items.push({
                quantidade: 1, 
                produto: produto
            });
        }

        this.storage.setCart(cart);
        return cart;
    }

    removeProduto(produto: ProdutoDTO) : Cart {
        let cart = this.getCart();
        let position = cart.items.findIndex(item => item.produto.id == produto.id);

        if(position != -1) {
            cart.items.splice(position, 1);
        }

        this.storage.setCart(cart);
        return cart;
    }

    increaseQuantity(produto: ProdutoDTO) : Cart {
        let cart = this.getCart();
        let position = cart.items.findIndex(item => item.produto.id == produto.id);

        if(position != -1) {
            cart.items[position].quantidade++;
        }

        this.storage.setCart(cart);
        return cart;
    }

    decreaseQuantity(produto: ProdutoDTO) : Cart {
        let cart = this.getCart();
        let position = cart.items.findIndex(item => item.produto.id == produto.id);

        if(position != -1) {
            cart.items[position].quantidade--;
            if(cart.items[position].quantidade < 1) {
                cart = this.removeProduto(produto);
            }
        }

        this.storage.setCart(cart);
        return cart;
    }

    total() : number {
        let total = 0;
        let cart = this.getCart();

        cart.items.forEach(item => {
            total += item.produto.preco * item.quantidade;
        });

        return total;
    }

}